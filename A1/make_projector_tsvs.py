#!/usr/bin/env python3
"""
make_projector_tsvs.py

Usage:
    python make_projector_tsvs.py --input /path/to/your_data.json
    python make_projector_tsvs.py --input /mnt/data/data.json --outdir ./projector_files --standardize

Output:
    ./projector_files/vectors.tsv   # required by projector (no header, tab-separated numeric vectors)
    ./projector_files/metadata.tsv  # optional metadata (with header)
"""

import argparse
import json
import os
import sys

import pandas as pd
from sklearn.preprocessing import StandardScaler

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def prepare_features(df, drop_cols=None, categorical_cols=None, numeric_cols=None, standardize=False):
    # Drop identifier columns from features (but keep them for metadata)
    if drop_cols:
        features_df = df.drop(columns=[c for c in drop_cols if c in df.columns])
    else:
        features_df = df.copy()

    # If categorical columns are not provided, infer likely ones
    if categorical_cols is None:
        # guess: columns of dtype object except 'name'/'id' already dropped
        categorical_cols = [c for c in features_df.columns if features_df[c].dtype == "object"]

    # If numeric columns not provided, infer
    if numeric_cols is None:
        numeric_cols = [c for c in features_df.columns if pd.api.types.is_numeric_dtype(features_df[c])]

    # One-hot encode categorical columns (drop_first=False to keep full encoding)
    if categorical_cols:
        features_encoded = pd.get_dummies(features_df, columns=categorical_cols, dummy_na=False, drop_first=False)
    else:
        features_encoded = features_df.copy()

    # Optionally standardize numeric columns (after encoding)
    if standardize:
        scaler = StandardScaler()
        # find numeric columns in the encoded dataframe
        num_cols_encoded = [c for c in features_encoded.columns if pd.api.types.is_numeric_dtype(features_encoded[c])]
        # StandardScaler expects 2D and floats
        features_encoded[num_cols_encoded] = scaler.fit_transform(features_encoded[num_cols_encoded].astype(float))

    return features_encoded

def write_vectors_tsv(df_vectors, out_path):
    # Write with no header and no index, tab-separated
    df_vectors.to_csv(out_path, sep="\t", header=False, index=False, float_format="%.6g")

def write_metadata_tsv(df_metadata, out_path):
    # Write metadata with header and index=False
    df_metadata.to_csv(out_path, sep="\t", header=True, index=False)

def main():
    parser = argparse.ArgumentParser(description="Convert JSON hierarchical records into vectors.tsv and metadata.tsv for TensorFlow Projector.")
    parser.add_argument("--input", "-i", required=True, help="Path to input JSON file (list of objects).")
    parser.add_argument("--outdir", "-o", default="projector_output", help="Output directory for vectors.tsv and metadata.tsv")
    parser.add_argument("--drop", nargs="*", default=["id", "name", "university"], help="Columns to drop from the feature vectors (kept in metadata). Default: id name")
    parser.add_argument("--categorical", nargs="*", default=["department", "faculty"], help="Categorical columns to one-hot encode. Default: department faculty university")
    parser.add_argument("--standardize", action="store_true", help="Standardize numeric columns (mean=0, std=1) after encoding.")
    parser.add_argument("--metadata_cols", nargs="*", default=["name", "department", "faculty",], help="Columns to include in metadata.tsv (in that order).")
    args = parser.parse_args()

    input_path = args.input
    outdir = args.outdir

    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(2)

    os.makedirs(outdir, exist_ok=True)

    data = load_json(input_path)
    # Convert to DataFrame
    df = pd.DataFrame(data)

    # Basic sanity checks
    if df.empty:
        print("Input JSON contains no records.", file=sys.stderr)
        sys.exit(3)

    # Prepare metadata (keep specified columns, fill missing)
    metadata_cols = [c for c in args.metadata_cols if c in df.columns]
    df_metadata = df[metadata_cols].copy()

    # If the user has columns missing from metadata_cols, fill them with empty strings to keep structure consistent
    for c in args.metadata_cols:
        if c not in df_metadata.columns:
            df_metadata[c] = ""

    # Prepare numeric feature matrix (drop id/name by default)
    features_df = df.copy()
    features_for_vectors = prepare_features(
        features_df,
        drop_cols=args.drop,
        categorical_cols=args.categorical,
        numeric_cols=None,
        standardize=args.standardize
    )

    # Final check: ensure vectors are all numeric
    non_numeric = [c for c in features_for_vectors.columns if not pd.api.types.is_numeric_dtype(features_for_vectors[c])]
    if non_numeric:
        print("Warning: Some columns are not numeric after encoding:", non_numeric, file=sys.stderr)
        # Try to coerce
        features_for_vectors = features_for_vectors.apply(pd.to_numeric, errors="coerce").fillna(0.0)

    vectors_path = os.path.join(outdir, "vectors.tsv")
    metadata_path = os.path.join(outdir, "metadata.tsv")

    write_vectors_tsv(features_for_vectors, vectors_path)
    write_metadata_tsv(df_metadata, metadata_path)

    print("Wrote:")
    print("  vectors:", vectors_path)
    print("  metadata:", metadata_path)
    print(f"Vector dimensionality: {features_for_vectors.shape[1]}, number of points: {features_for_vectors.shape[0]}")

if __name__ == "__main__":
    main()
