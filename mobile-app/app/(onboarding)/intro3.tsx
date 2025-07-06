import OnboardingScreen from "@/components/onboarding/OnboardingScreen";

export default function Intro3() {
  return (
    <OnboardingScreen
      title="We Respect Your Privacy"
      description="Your crop data is secure. You control what to share or keep private."
      image={require('../../assets/images/privacy.png')}
      isLast
    />
  );
}
