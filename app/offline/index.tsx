import OfflineInfoCard from "@/components/offline/OfflineInfoCard";
import OfflineTipsList from "@/components/offline/OfflineTipsList";
import SaveForLaterButton from "@/components/offline/SaveForLaterButton";
import { ScrollView } from "react-native";


export default function OfflineModeScreen() {
  const handleSave = () => {
    // Placeholder for saving logic
    alert('Saved, Photo saved for later sync.');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <OfflineInfoCard />
      <OfflineTipsList />
      <SaveForLaterButton onSave={handleSave} />
    </ScrollView>
  );
}