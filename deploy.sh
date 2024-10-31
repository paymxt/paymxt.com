#!/bin/bash

# Load environment variables from the .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Define and validate required environment variables
OUTPUT_DIR=".output/public"
S3_BUCKET="${S3_BUCKET_NAME:?Error: S3_BUCKET_NAME is not set in the environment variables}"
AWS_REGION="${AWS_REGION:?Error: AWS_REGION is not set in the environment variables}"
DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:?Error: CLOUDFRONT_DISTRIBUTION_ID is not set in the environment variables}"

# Colors for output formatting
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Debug: Print bucket, region, and distribution ID to verify
echo -e "${GREEN}S3 Bucket: $S3_BUCKET${NC}"
echo -e "${GREEN}AWS Region: $AWS_REGION${NC}"
echo -e "${GREEN}CloudFront Distribution ID: $DISTRIBUTION_ID${NC}"

# Step 1: Generate static files
echo -e "${GREEN}Generating static files...${NC}"
npx nuxi generate

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to generate static files.${NC}"
    exit 1
fi

# Step 2: Sync files to S3
echo -e "${GREEN}Syncing files to S3...${NC}"
aws s3 sync $OUTPUT_DIR s3://$S3_BUCKET/ --delete --exact-timestamps --region $AWS_REGION

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to sync files to S3.${NC}"
    exit 1
fi

# Step 3: Create CloudFront cache invalidation
echo -e "${GREEN}Creating CloudFront cache invalidation...${NC}"
INVALIDATION_OUTPUT=$(aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" --region $AWS_REGION)

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to create CloudFront cache invalidation.${NC}"
    exit 1
fi

# Extract invalidation ID from output
INVALIDATION_ID=$(echo $INVALIDATION_OUTPUT | grep -o '"Id": "[^"]*' | grep -o '[^"]*$')

echo -e "${GREEN}Successfully created CloudFront cache invalidation with ID: ${INVALIDATION_ID}${NC}"

# Step 4: Display completion message
echo -e "${GREEN}Deployment complete!${NC}"
