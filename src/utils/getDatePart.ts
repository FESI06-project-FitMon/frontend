export default function getDatePart(dateTimeString: string | undefined): string {
  if (!dateTimeString) {
    return '';
  }

  try {
    // ISO 형식의 날짜 문자열인지 확인
    if (dateTimeString.includes('T')) {
      return dateTimeString.split('T')[0];
    }
    
    // 이미 날짜 부분만 있는 경우
    return dateTimeString;
  } catch (error) {
    console.error('Date parsing error:', error);
    return '';
  }
}