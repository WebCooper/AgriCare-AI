import OnboardingScreen from '@/components/onboarding/OnboardingScreen';

export default function Intro1() {
  return (
    <OnboardingScreen
      title="Scan Your Crops Easily"
      description="Use your camera or gallery to detect crop diseases in seconds using AI."
      image={require('../../assets/images/scan.png')}
      nextScreen="/(onboarding)/intro2"
    />
  );
}
