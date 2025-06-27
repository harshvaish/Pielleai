import { Check, Loader } from 'lucide-react';

export default function StepIndicator({
  step,
  currentStep,
}: {
  step: number;
  currentStep: number;
}) {
  if (currentStep < step) {
    return (
      <div className='w-6 h-6 flex justify-center items-center bg-zinc-200 rounded-sm'>
        <div className='w-2 h-2 bg-zinc-400 rounded-full'></div>
      </div>
    );
  }

  if (currentStep === step) {
    return (
      <div className='w-6 h-6 flex justify-center items-center bg-black rounded-sm'>
        <Loader
          size={16}
          className='text-white'
        />
      </div>
    );
  }

  if (currentStep > step) {
    return (
      <div className='w-6 h-6 flex justify-center items-center bg-emerald-100 rounded-sm'>
        <Check
          size={16}
          className='text-emerald-400'
        />
      </div>
    );
  }
}
