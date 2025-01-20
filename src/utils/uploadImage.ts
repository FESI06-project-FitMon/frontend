import instance from '@/utils/axios';

type UploadType = 'MEMBER' | 'GATHERING' | 'CHALLENGE';

const uploadImage = async (
  file: File,
  type: UploadType,
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('file', file);

   // FormData는 특별한 처리가 필요하므로 직접 instance 사용
  const response = await instance.request<{ imageUrl: string }>({
    url: `api/v1/images?type=${type}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export default uploadImage;
