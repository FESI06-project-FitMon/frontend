interface StepProps {
  currentStep: number; // 현재 활성화된 단계 (0부터 시작)
}

export default function Step({ currentStep }: StepProps) {
  const steps = ['분류 확인', '세부 정보', '챌린지 선택'];

  const styles = {
    iconBase: 'w-8 h-8 flex items-center justify-center rounded-full',
    lineBase:
      'absolute top-1/2 left-1/2 transform translate-x-4 -translate-y-1/2 w-24 h-[2px]',
    textBase: 'mt-2 text-sm font-semibold',
  };

  const getIconStyle = (index: number) => {
    if (currentStep > index) return `${styles.iconBase} bg-red-500 text-white`;
    if (currentStep === index)
      return `${styles.iconBase} bg-white border-2 border-red-500 text-red-500`;
    return `${styles.iconBase} bg-dark-500 text-white`;
  };

  const getLineStyle = (index: number) => {
    return currentStep > index
      ? `${styles.lineBase} bg-red-500`
      : `${styles.lineBase} border border-dark-400 border-dashed`;
  };

  const getTextStyle = (index: number) => {
    return `${styles.textBase} ${
      currentStep >= index ? 'text-red-500' : 'text-dark-600'
    }`;
  };

  return (
    <div className="relative flex items-center justify-center w-full md:max-w-lg pt-4 mb-5">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center w-24">
          {/* 동그라미 */}
          <div className="relative flex items-center">
            <div className={getIconStyle(index)}>
              {currentStep > index ? '✔' : index + 1}
            </div>

            {/* 진행선 */}
            {index < steps.length - 1 && (
              <div className={getLineStyle(index)}></div>
            )}
          </div>

          {/* 단계 텍스트 */}
          <span className={getTextStyle(index)}>{step}</span>
        </div>
      ))}
    </div>
  );
}
