import os
import uuid
import abc
from app.config import settings

class BaseStorageAdapter(abc.ABC):
    @abc.abstractmethod
    def save_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        """Saves file and returns public or accessible URL."""
        pass

class LocalStorageAdapter(BaseStorageAdapter):
    def __init__(self, upload_dir: str):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        ext = os.path.splitext(filename)[1].lower()
        unique_name = f"{uuid.uuid4().hex[:12]}{ext}"
        target_path = os.path.join(self.upload_dir, unique_name)
        with open(target_path, "wb") as f:
            f.write(file_bytes)
        return f"/uploads/{unique_name}"

class CloudinaryStorageAdapter(BaseStorageAdapter):
    def __init__(self, cloudinary_url: str):
        self.cloudinary_url = cloudinary_url

    def save_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        try:
            import cloudinary
            import cloudinary.uploader
            cloudinary.config(cloudinary_url=self.cloudinary_url)
            result = cloudinary.uploader.upload(file_bytes, folder="portfolio")
            return result.get("secure_url", result.get("url"))
        except Exception as e:
            # Fallback to local if Cloudinary call fails or package missing
            print(f"Cloudinary upload failed, falling back to local: {e}")
            local_adapter = LocalStorageAdapter(
                os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
            )
            return local_adapter.save_file(file_bytes, filename, content_type)

class S3StorageAdapter(BaseStorageAdapter):
    def __init__(self, bucket: str, region: str, endpoint_url: str = ""):
        self.bucket = bucket
        self.region = region
        self.endpoint_url = endpoint_url

    def save_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        try:
            import boto3
            session = boto3.session.Session()
            client_kwargs = {
                "service_name": "s3",
                "region_name": self.region,
                "aws_access_key_id": settings.AWS_ACCESS_KEY_ID,
                "aws_secret_access_key": settings.AWS_SECRET_ACCESS_KEY,
            }
            if self.endpoint_url:
                client_kwargs["endpoint_url"] = self.endpoint_url
            s3 = session.client(**client_kwargs)

            ext = os.path.splitext(filename)[1].lower()
            key = f"portfolio/{uuid.uuid4().hex[:12]}{ext}"
            s3.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=file_bytes,
                ContentType=content_type
            )
            if self.endpoint_url:
                return f"{self.endpoint_url.rstrip('/')}/{self.bucket}/{key}"
            return f"https://{self.bucket}.s3.{self.region}.amazonaws.com/{key}"
        except Exception as e:
            print(f"S3 upload failed, falling back to local: {e}")
            local_adapter = LocalStorageAdapter(
                os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
            )
            return local_adapter.save_file(file_bytes, filename, content_type)

def get_storage_adapter() -> BaseStorageAdapter:
    upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    if settings.STORAGE_TYPE == "cloudinary" and settings.CLOUDINARY_URL:
        return CloudinaryStorageAdapter(settings.CLOUDINARY_URL)
    elif settings.STORAGE_TYPE == "s3" and settings.AWS_S3_BUCKET:
        return S3StorageAdapter(settings.AWS_S3_BUCKET, settings.AWS_REGION, settings.S3_ENDPOINT_URL)
    return LocalStorageAdapter(upload_dir)
