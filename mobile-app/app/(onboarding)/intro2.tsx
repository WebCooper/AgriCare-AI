import OnboardingScreen from "@/components/onboarding/OnboardingScreen";

export default function Intro2() {
  return (
    <OnboardingScreen
      title="Works Even When Offline"
      description="Diagnose common crop diseases offline and sync results when you're online again."
      image={require('../../assets/images/offline.png')}
      nextScreen="/(onboarding)/intro3"
    />
  );
}
