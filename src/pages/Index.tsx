import CamperCard from "@/components/CamperCard";
import { mockCampers } from "@/data/campers";

const Index = () => {
  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Finden Sie Ihr perfektes Wohnmobil</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Entdecken Sie Deutschland und Europa mit unseren hochwertigen Wohnmobilen. 
          Von kompakten Campervans bis hin zu luxuriösen Reisemobilen.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCampers.map((camper) => (
          <CamperCard key={camper.id} camper={camper} />
        ))}
      </div>
    </div>
  );
};

export default Index;
