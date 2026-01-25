import os
import boto3
import mimetypes
from botocore.exceptions import NoCredentialsError, ClientError

BUCKET_NAME = 'book-blog'
CLOUDFRONT_DISTRIBUTION_IDS = [""]

# Path to the build directory.
BUILD_DIR = 'build'


def upload_files_to_s3(build_dir: str, bucket_name: str):
  for root, dirs, files in os.walk(build_dir):
    for file in files:
      file_path = os.path.join(root, file)
      content_type = mimetypes.guess_type(file)[0]
      extra_args = {'ContentType': content_type} if content_type else {}
      s3_key = os.path.relpath(file_path, build_dir)
      try:
        s3.upload_file(file_path, bucket_name, s3_key, extra_args)
        print(f'Successfully uploaded {file_path} to s3://{bucket_name}/{s3_key}')
      except FileNotFoundError:
        print(f'The file was not found: {file_path}')
      except NoCredentialsError:
        print('Credentials not available')
      except ClientError as e:
        print(f'Failed to upload {file_path}: {e}')


def invalidate_cloudfront(distribution_ids: list[str], paths: list, client):
  try:
    for distribution_id in distribution_ids:
      response = client.create_invalidation(
        DistributionId=distribution_id,
        InvalidationBatch={
          'Paths': {
            'Quantity': len(paths),
            'Items': paths
          },
          'CallerReference': str(hash(frozenset(paths)))  # unique string per request
        }
      )

      invalidation_id = response['Invalidation']['Id']
      print(f'Invalidation created: {invalidation_id}')
  except ClientError as e:
    print(f'Failed to create invalidation: {e}')


if __name__ == '__main__':
  print("Uploading build to s3.")
  s3 = boto3.client('s3')

  upload_files_to_s3(BUILD_DIR, BUCKET_NAME)

  print("Invalidating CloudFront cache...")
  cloudfront = boto3.client('cloudfront')
  invalidate_cloudfront(CLOUDFRONT_DISTRIBUTION_IDS, ['/*'], cloudfront)
