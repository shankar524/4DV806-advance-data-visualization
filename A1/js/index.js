// Configuration
const config = {
    width: 800,
    height: 800,
    margin: 10,
    transitionDuration: 750
};

// Color schemes for different levels
const colorSchemes = {
    faculty: {
        'Faculty of Technology (FTK)': '#667eea',
        'Faculty of Arts and Humanities (FKH)': '#f093fb'
    },
    department: {
        'Dept. of Computer Science and Media Technology (DM)': '#4facfe',
        'Dept. of Mathematics (MA)': '#43e97b',
        'Dept. of Languages (SPR)': '#fa709a'
    }
};

let allData, data, hierarchy, root;
let svg, g, tooltip;
let currentNode = null;
let selectedYear = 'all'; // 'all', '2019', '2020'

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load data
        const response = await fetch('data/publications-stats.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allData = await response.json();
        data = allData; // Initially show all data
        
        // Setup
        setupTooltip();
        setupYearFilter();
        processData();
        createLegend();
        createSunburst();
        
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('visualization').innerHTML = 
            '<p style="color: red;">Error loading data. Please check the console.</p>';
    }
});

// Setup tooltip
function setupTooltip() {
    tooltip = d3.select('#tooltip');
}

// Setup year filter dropdown
function setupYearFilter() {
    const yearFilter = document.getElementById('yearFilter');
    
    yearFilter.addEventListener('change', function() {
        selectedYear = this.value;
        
        if (selectedYear === 'all') {
            data = allData;
        } else {
            data = allData.filter(d => d.year === parseInt(selectedYear));
        }
        
        processData();
        createSunburst();
    });
}


// Process data into hierarchical structure
function processData() {
    // Group by university -> faculty -> department -> student
    const nested = {
        name: 'PSU',
        children: []
    };
    
    // Group by faculty
    const faculties = d3.group(data, d => d.faculty);
    
    faculties.forEach((facultyData, facultyName) => {
        const facultyNode = {
            name: facultyName,
            children: [],
            type: 'faculty'
        };
        
        // Group by department
        const departments = d3.group(facultyData, d => d.department);
        
        departments.forEach((deptData, deptName) => {
            const deptNode = {
                name: deptName,
                children: [],
                type: 'department'
            };
            
            // Add students
            deptData.forEach(student => {
                deptNode.children.push({
                    name: student.name,
                    value: student.pubs,
                    type: 'student',
                    year: student.year,
                    id: student.id
                });
            });
            
            facultyNode.children.push(deptNode);
        });
        
        nested.children.push(facultyNode);
    });
    
    // Create hierarchy
    hierarchy = d3.hierarchy(nested)
        .sum(d => d.value || 0)
        .sort((a, b) => b.value - a.value);
    
    root = hierarchy;
}

// Create legend
function createLegend() {
    const legendContainer = d3.select('#legend');
    legendContainer.html('');
    
    // Add title
    legendContainer.append('div')
        .attr('class', 'legend-title')
        .text('Legend');
    
    // Faculty to Department mapping
    const facultyDeptMap = {
        'Faculty of Technology (FTK)': [
            'Dept. of Computer Science and Media Technology (DM)',
            'Dept. of Mathematics (MA)'
        ],
        'Faculty of Arts and Humanities (FKH)': [
            'Dept. of Languages (SPR)'
        ]
    };
    
    // Create hierarchical legend
    Object.entries(colorSchemes.faculty).forEach(([facultyName, facultyColor]) => {
        const facultySection = legendContainer.append('div').attr('class', 'legend-faculty');
        
        // Faculty header
        const facultyHeader = facultySection.append('div').attr('class', 'legend-faculty-header');
        facultyHeader.append('div')
            .attr('class', 'legend-color')
            .style('background', facultyColor);
        facultyHeader.append('span')
            .attr('class', 'legend-label')
            .text(facultyName.split('(')[0].trim());
        
        // Add departments under this faculty
        const departments = facultyDeptMap[facultyName] || [];
        departments.forEach(deptName => {
            const deptColor = colorSchemes.department[deptName];
            if (deptColor) {
                const deptItem = facultySection.append('div').attr('class', 'legend-dept-item');
                deptItem.append('div')
                    .attr('class', 'legend-color-dept')
                    .style('background', deptColor);
                deptItem.append('span')
                    .attr('class', 'legend-label-dept')
                    .text(deptName.split('(')[0].trim());
            }
        });
    });
}

// Create Sunburst
function createSunburst() {
    // Clear existing
    d3.select('#sunburst').selectAll('*').remove();
    
    const radius = Math.min(config.width, config.height) / 2;
    
    svg = d3.select('#sunburst')
        .attr('width', config.width)
        .attr('height', config.height)
        .attr('viewBox', [-config.width / 2, -config.height / 2, config.width, config.height])
        .style('max-width', '100%')
        .style('height', 'auto');
    
    g = svg.append('g');
    
    // Create partition layout
    const partition = d3.partition()
        .size([2 * Math.PI, radius]);
    
    partition(root);
    
    // Create arc generator
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius / 2)
        .innerRadius(d => d.y0)
        .outerRadius(d => d.y1 - 1);
    
    // Create paths
    const paths = g.selectAll('path')
        .data(root.descendants().filter(d => d.depth))
        .join('path')
        .attr('fill', d => getColor(d))
        .attr('d', arc)
        .style('opacity', d => d.depth === 0 ? 0 : 1)
        .on('click', clicked)
        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut);
    
    // Add center circle for reset
    g.append('circle')
        .attr('r', radius / 4)
        .style('fill', 'white')
        .style('cursor', 'pointer')
        .style('stroke', '#667eea')
        .style('stroke-width', 3)
        .on('click', () => {
            if (currentNode !== root) {
                clicked(new Event('click'), root);
            }
        });
    
    // Add center text
    const totalStudents = data.length;
    const yearText = selectedYear === 'all' ? '' : ` (${selectedYear})`;
    
    g.append('text')
        .attr('class', 'center-text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-2.2em')
        .style('font-size', '24px')
        .style('font-weight', 'bold')
        .style('fill', '#667eea')
        .text(root.data.name);
    
    if (yearText) {
        g.append('text')
            .attr('class', 'center-text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.8em')
            .style('font-size', '14px')
            .style('fill', '#999')
            .text(yearText);
    }
    
    g.append('text')
        .attr('class', 'center-text')
        .attr('text-anchor', 'middle')
        .attr('dy', yearText ? '0.5em' : '0em')
        .style('font-size', '16px')
        .style('fill', '#666')
        .text(`${root.value} Publications`);
    
    g.append('text')
        .attr('class', 'center-text')
        .attr('text-anchor', 'middle')
        .attr('dy', yearText ? '2em' : '1.5em')
        .style('font-size', '16px')
        .style('fill', '#666')
        .text(`${totalStudents} Students`);
    
    currentNode = root;
    
    // Click handler for zoom
    function clicked(event, p) {
        event.stopPropagation();
        
        currentNode = p;
        
        // Update center text
        g.selectAll('.center-text')
            .transition()
            .duration(config.transitionDuration)
            .style('opacity', 0)
            .remove();
        
        setTimeout(() => {
            const shortName = p.data.name.length > 30 ? 
                p.data.name.substring(0, 30) + '...' : p.data.name;
            const yearText = selectedYear === 'all' ? '' : ` (${selectedYear})`;
            
            g.append('text')
                .attr('class', 'center-text')
                .attr('text-anchor', 'middle')
                .attr('dy', yearText ? '-2.2em' : '-1.5em')
                .style('font-size', '20px')
                .style('font-weight', 'bold')
                .style('fill', '#667eea')
                .style('opacity', 0)
                .text(shortName)
                .transition()
                .duration(config.transitionDuration)
                .style('opacity', 1);
            
            if (yearText) {
                g.append('text')
                    .attr('class', 'center-text')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '-0.8em')
                    .style('font-size', '12px')
                    .style('fill', '#999')
                    .style('opacity', 0)
                    .text(yearText)
                    .transition()
                    .duration(config.transitionDuration)
                    .style('opacity', 1);
            }
            
            g.append('text')
                .attr('class', 'center-text')
                .attr('text-anchor', 'middle')
                .attr('dy', yearText ? '0.5em' : '0em')
                .style('font-size', '14px')
                .style('fill', '#666')
                .style('opacity', 0)
                .text(`${p.value} Publications`)
                .transition()
                .duration(config.transitionDuration)
                .style('opacity', 1);
            
            // Count students in this node
            const studentCount = p.descendants().filter(d => d.data.type === 'student').length;
            g.append('text')
                .attr('class', 'center-text')
                .attr('text-anchor', 'middle')
                .attr('dy', yearText ? '2em' : '1.5em')
                .style('font-size', '14px')
                .style('fill', '#666')
                .style('opacity', 0)
                .text(`${studentCount} Students`)
                .transition()
                .duration(config.transitionDuration)
                .style('opacity', 1);
        }, config.transitionDuration / 2);
        
        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.y0),
            y1: Math.max(0, d.y1 - p.y0)
        });
        
        const t = g.transition().duration(config.transitionDuration);
        
        paths.transition(t)
            .tween('data', d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .attr('d', d => {
                const current = d.current;
                return d3.arc()
                    .startAngle(current.x0)
                    .endAngle(current.x1)
                    .padAngle(Math.min((current.x1 - current.x0) / 2, 0.005))
                    .padRadius(radius / 2)
                    .innerRadius(current.y0)
                    .outerRadius(current.y1 - 1)(d);
            })
            .style('opacity', d => d.target.x1 - d.target.x0 > 0.001 ? 1 : 0);
    }
    
    // Initialize current position
    root.each(d => d.current = {
        x0: d.x0,
        x1: d.x1,
        y0: d.y0,
        y1: d.y1
    });
}

// Get color for node
function getColor(d) {
    if (d.depth === 0) return '#ffffff';
    
    // Find the parent faculty and department
    let node = d;
    let faculty = null;
    let department = null;
    
    while (node) {
        if (node.data.type === 'faculty') faculty = node.data.name;
        if (node.data.type === 'department') department = node.data.name;
        node = node.parent;
    }
    
    // Faculty level
    if (d.data.type === 'faculty') {
        return colorSchemes.faculty[d.data.name] || '#999';
    }
    
    // Department level
    if (d.data.type === 'department') {
        return colorSchemes.department[d.data.name] || '#666';
    }
    
    // Student level - use department color with variation
    if (d.data.type === 'student') {
        const baseColor = colorSchemes.department[department] || '#999';
        return d3.color(baseColor).brighter(0.5);
    }
    
    return '#cccccc';
}

// Mouse event handlers
function handleMouseOver(event, d) {
    tooltip.style('opacity', 1);
    d3.select(event.currentTarget).style('opacity', 1);
}

function handleMouseMove(event, d) {
    let html = `<div class="name">${d.data.name}</div>`;
    html += `<div class="info">📚 Publications: <strong>${d.value}</strong></div>`;
    
    if (d.data.type === 'faculty') {
        const deptCount = d.children ? d.children.length : 0;
        html += `<div class="info">🏢 Departments: ${deptCount}</div>`;
    } else if (d.data.type === 'department') {
        const studentCount = d.children ? d.children.length : 0;
        html += `<div class="info">👨‍🎓 Students: ${studentCount}</div>`;
    } else if (d.data.type === 'student') {
        html += `<div class="info">📅 Year: ${d.data.year}</div>`;
    }
    
    tooltip.html(html)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 15) + 'px');
}

function handleMouseOut(event, d) {
    tooltip.style('opacity', 0);
    d3.select(event.currentTarget).style('opacity', null);
}
