import MainActions from "@/components/home/MainActions";
import QuickStats from "@/components/home/QuickStats";
import TopPanel from "@/components/home/TopPanel";
import { ScrollView } from "react-native";

export default function HomeScreen() {
    return (
      <ScrollView className="flex-1 p-4 bg-gray-50">
        <TopPanel />
        <MainActions />
        <QuickStats />
      </ScrollView>
    );
  }