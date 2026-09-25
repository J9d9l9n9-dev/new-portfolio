from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from app.auth import get_current_admin
from app.models import AdminUser
from app.config import settings
from app.storage import get_storage_adapter

router = APIRouter(prefix="/upload", tags=["Uploads"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    current_admin: AdminUser = Depends(get_current_admin)
):
    # Validate content type
    content_type = file.content_type or ""
    if content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{content_type}'. Allowed types: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )
    
    # Read file contents and check size
    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)}MB"
        )
    
    # Delegate to storage adapter (Cloudinary / S3 / Local fallback)
    storage = get_storage_adapter()
    file_url = storage.save_file(file_bytes, file.filename or "upload.bin", content_type)

    return {
        "url": file_url,
        "filename": file.filename,
        "size": len(file_bytes),
        "content_type": content_type
    }
