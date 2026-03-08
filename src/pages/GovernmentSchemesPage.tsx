import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ExternalLink, Landmark, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

const schemes = [
  {
    id: 1, name: "PM-KISAN", fullName: "Pradhan Mantri Kisan Samman Nidhi",
    description: "Direct income support of ₹6,000 per year to small and marginal farmer families, paid in three equal installments.",
    category: "Income Support", eligibility: "Small & marginal farmers with cultivable land",
    amount: "₹6,000/year", link: "https://pmkisan.gov.in",
  },
  {
    id: 2, name: "PMFBY", fullName: "Pradhan Mantri Fasal Bima Yojana",
    description: "Crop insurance scheme providing financial support to farmers in case of crop failure due to natural calamities, pests, and diseases.",
    category: "Insurance", eligibility: "All farmers growing notified crops",
    amount: "Varies by crop", link: "https://pmfby.gov.in",
  },
  {
    id: 3, name: "KCC", fullName: "Kisan Credit Card",
    description: "Provides farmers with affordable credit for crop production, post-harvest expenses, and allied activities.",
    category: "Credit", eligibility: "All farmers, sharecroppers, tenant farmers",
    amount: "Up to ₹3 lakh at 4% interest", link: "https://www.nabard.org",
  },
  {
    id: 4, name: "PMKSY", fullName: "Pradhan Mantri Krishi Sinchayee Yojana",
    description: "Ensures access to protective irrigation to every farm (Har Khet Ko Paani) and improves water-use efficiency.",
    category: "Irrigation", eligibility: "All farmers",
    amount: "Subsidy up to 55-75%", link: "https://pmksy.gov.in",
  },
  {
    id: 5, name: "Soil Health Card", fullName: "Soil Health Card Scheme",
    description: "Provides soil health cards to farmers with crop-wise nutrient recommendations to improve soil fertility and productivity.",
    category: "Soil Health", eligibility: "All farmers",
    amount: "Free service", link: "https://soilhealth.dac.gov.in",
  },
  {
    id: 6, name: "eNAM", fullName: "National Agriculture Market",
    description: "Online trading platform for agricultural commodities. Promotes transparency and competitive pricing.",
    category: "Marketing", eligibility: "All farmers and traders",
    amount: "No cost for farmers", link: "https://enam.gov.in",
  },
  {
    id: 7, name: "Sub-Mission on Agricultural Mechanization", fullName: "SMAM",
    description: "Provides subsidies on purchase of agricultural machinery and equipment to boost farm productivity.",
    category: "Mechanization", eligibility: "All farmers, preference to SC/ST/women",
    amount: "Subsidy 40-50%", link: "https://agrimachinery.nic.in",
  },
  {
    id: 8, name: "PKVY", fullName: "Paramparagat Krishi Vikas Yojana",
    description: "Promotes organic farming through adoption of organic village clusters and PGS certification.",
    category: "Organic Farming", eligibility: "Groups of 50+ farmers in a cluster",
    amount: "₹50,000/ha over 3 years", link: "https://pgsindia-ncof.gov.in",
  },
  {
    id: 9, name: "MIDH", fullName: "Mission for Integrated Development of Horticulture",
    description: "Promotes holistic growth of horticulture sector through area-based and demand-driven strategies.",
    category: "Horticulture", eligibility: "All horticulture farmers",
    amount: "Varies by component", link: "https://midh.gov.in",
  },
  {
    id: 10, name: "PM-KUSUM", fullName: "Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan",
    description: "Promotes installation of solar pumps and grid-connected solar power plants by farmers.",
    category: "Solar Energy", eligibility: "All farmers",
    amount: "Subsidy up to 60%", link: "https://mnre.gov.in",
  },
];

const allCategories = [...new Set(schemes.map((s) => s.category))];

const GovernmentSchemesPage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = schemes.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Landmark className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Government Schemes</h1>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover subsidies, insurance, credit, and support programs available for farmers
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search schemes..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filtered.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{scheme.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{scheme.fullName}</p>
                  </div>
                  <Badge variant="secondary">{scheme.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{scheme.description}</p>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-foreground"><strong>Eligibility:</strong> {scheme.eligibility}</span>
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5" /> {scheme.amount}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                    Learn More <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No schemes found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernmentSchemesPage;
