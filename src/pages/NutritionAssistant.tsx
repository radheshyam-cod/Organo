import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Info,
  Brain,
} from "lucide-react";
import {
  generatePersonalizedPlan,
  type UserHealthProfile,
  type Goal,
  type ActivityLevel,
  type WorkoutType,
  type StressLevel,
  type SleepQuality,
  type JuicePlanRecommendation,
} from "../ai/nutritionAssistant";
import { useCart } from "../features/cart/CartContext";
import { useAuth } from "../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface FormData extends Partial<UserHealthProfile> {
  goal?: Goal;
  age?: number;
  gender?: "male" | "female" | "other";
  weight?: number;
  height?: number;
  activityLevel?: ActivityLevel;
  workoutType?: WorkoutType;
  workoutFrequency?: number;
  workoutTiming?: "morning" | "afternoon" | "evening";
  sleepQuality?: SleepQuality;
  sleepHours?: number;
  stressLevel?: StressLevel;
  sugarSensitivity?: boolean;
  diabetesRisk?: "low" | "moderate" | "high";
  wantsJuiceOnly?: boolean;
}

const STEPS = ["Goal", "Demographics", "Fitness", "Health", "Diet", "Medical", "Review"] as const;

export const NutritionAssistant = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [plan, setPlan] = useState<ReturnType<typeof generatePersonalizedPlan> | null>(null);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleSavePlan = () => {
    if (!isAuthenticated || !user) {
      alert("Please log in or create an account to save your plan!");
      navigate("/account");
      return;
    }
    const savedPlans = JSON.parse(localStorage.getItem("organo_saved_plans") || "{}");
    savedPlans[user.email] = plan;
    localStorage.setItem("organo_saved_plans", JSON.stringify(savedPlans));
    alert("Your plan has been saved to your account!");
  };

  const updateForm = (
    key: keyof FormData,
    value:
      | string
      | number
      | boolean
      | string[]
      | Goal
      | ActivityLevel
      | WorkoutType
      | StressLevel
      | SleepQuality
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateAndShowPlan();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const generateAndShowPlan = () => {
    const profile = formData as UserHealthProfile;
    if (!profile.goal || !profile.age || !profile.weight || !profile.height) {
      alert("Please fill in all required fields");
      return;
    }
    const generatedPlan = generatePersonalizedPlan(profile);
    setPlan(generatedPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-organo-cream via-white to-organo-pistachio/5 pt-24 pb-16 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-organo-pistachio/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-organo-green/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-organo-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {!plan ? (
          <>
            {/* Enhanced Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-organo-green/10 to-organo-pistachio/10 text-organo-green px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest mb-6 shadow-lg">
                <Sparkles size={16} className="animate-spin" style={{ animationDuration: "3s" }} />
                Personalized
                <Brain className="w-4 h-4" />
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-organo-green mb-4">
                Nutrition Assistant
              </h1>
              <p className="text-organo-gray text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Answer a few questions and receive your personalized daily juice plan
              </p>
            </div>

            {/* Enhanced Progress bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex gap-2 mb-4">
                {STEPS.map((step, idx) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      idx <= currentStep
                        ? "bg-gradient-to-r from-organo-green to-organo-pistachio"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                {STEPS.map((step, idx) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                    className={`font-medium ${idx <= currentStep ? "text-organo-green" : ""}`}
                  >
                    {step}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Form Steps */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 min-h-96">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Step 1: Goal */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="font-serif text-2xl text-organo-green mb-4">
                          What's your primary goal?
                        </h2>
                        <div className="space-y-3">
                          {["fat-loss", "recovery", "immunity"].map((goal) => (
                            <button
                              key={goal}
                              onClick={() => updateForm("goal", goal)}
                              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                                formData.goal === goal
                                  ? "border-organo-green bg-organo-green/10"
                                  : "border-gray-200 hover:border-organo-green/50"
                              }`}
                            >
                              <div className="font-bold text-organo-green capitalize">
                                {goal.replace("-", " ")}
                              </div>
                              <div className="text-sm text-gray-500">
                                {goal === "fat-loss" && "Lose weight and improve body composition"}
                                {goal === "recovery" && "Build muscle and recover from exercise"}
                                {goal === "immunity" && "Strengthen immune system and wellness"}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Demographics */}
                  {currentStep === 1 && <FormStep2 formData={formData} updateForm={updateForm} />}

                  {/* Step 3: Fitness */}
                  {currentStep === 2 && <FormStep3 formData={formData} updateForm={updateForm} />}

                  {/* Step 4: Health & Lifestyle */}
                  {currentStep === 3 && <FormStep4 formData={formData} updateForm={updateForm} />}

                  {/* Step 5: Diet & Preferences */}
                  {currentStep === 4 && <FormStep5 formData={formData} updateForm={updateForm} />}

                  {/* Step 6: Medical */}
                  {currentStep === 5 && <FormStep6 formData={formData} updateForm={updateForm} />}

                  {/* Step 7: Review */}
                  {currentStep === 6 && <FormStep7 formData={formData} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="max-w-2xl mx-auto mt-8 flex gap-4 justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                  currentStep === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-organo-green border-2 border-organo-green hover:bg-organo-green/10"
                }`}
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-organo-green text-white rounded-lg font-bold hover:bg-organo-green/90 transition-all"
              >
                {currentStep === STEPS.length - 1 ? "Generate Plan" : "Next"}
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <PlanDisplay
            plan={plan}
            onRestart={() => {
              setPlan(null);
              setCurrentStep(0);
              setFormData({});
            }}
            addToCart={addToCart}
            onSave={handleSavePlan}
          />
        )}
      </div>
    </div>
  );
};

// Form Step Components
interface FormStepProps {
  formData: FormData;
  updateForm: (
    key: keyof FormData,
    value:
      | string
      | number
      | boolean
      | string[]
      | Goal
      | ActivityLevel
      | WorkoutType
      | StressLevel
      | SleepQuality
  ) => void;
}

const FormStep2 = ({ formData, updateForm }: FormStepProps) => (
  <div className="space-y-6">
    <h2 className="font-serif text-2xl text-organo-green mb-4">Your Demographics</h2>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Age *</label>
      <input
        type="number"
        min="13"
        max="120"
        value={formData.age || ""}
        onChange={(e) => updateForm("age", parseInt(e.target.value))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
        placeholder="25"
      />
    </div>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Gender</label>
      <select
        value={formData.gender || ""}
        onChange={(e) => updateForm("gender", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
      >
        <option value="">Select...</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-bold text-organo-green mb-2">Weight (kg) *</label>
        <input
          type="number"
          min="40"
          max="250"
          value={formData.weight || ""}
          onChange={(e) => updateForm("weight", parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
          placeholder="70"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-organo-green mb-2">Height (cm) *</label>
        <input
          type="number"
          min="140"
          max="220"
          value={formData.height || ""}
          onChange={(e) => updateForm("height", parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
          placeholder="175"
        />
      </div>
    </div>
  </div>
);

const FormStep3 = ({ formData, updateForm }: FormStepProps) => (
  <div className="space-y-6">
    <h2 className="font-serif text-2xl text-organo-green mb-4">Your Fitness Routine</h2>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Activity Level *</label>
      <select
        value={formData.activityLevel || ""}
        onChange={(e) => updateForm("activityLevel", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
      >
        <option value="">Select...</option>
        <option value="sedentary">Sedentary (little to no exercise)</option>
        <option value="light">Light (1-3 days/week)</option>
        <option value="moderate">Moderate (3-5 days/week)</option>
        <option value="active">Active (6-7 days/week)</option>
        <option value="very-active">Very Active (intense daily)</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Workout Type</label>
      <select
        value={formData.workoutType || ""}
        onChange={(e) => updateForm("workoutType", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
      >
        <option value="none">None</option>
        <option value="cardio">Cardio (running, cycling, swimming)</option>
        <option value="strength">Strength Training</option>
        <option value="mixed">Mixed (cardio + strength)</option>
        <option value="yoga">Yoga / Flexibility</option>
        <option value="sports">Sports</option>
      </select>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-bold text-organo-green mb-2">
          Frequency (days/week)
        </label>
        <input
          type="number"
          min="0"
          max="7"
          value={formData.workoutFrequency || ""}
          onChange={(e) => updateForm("workoutFrequency", parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
          placeholder="3"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-organo-green mb-2">Workout Time</label>
        <select
          value={formData.workoutTiming || ""}
          onChange={(e) => updateForm("workoutTiming", e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
        >
          <option value="">Select...</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>
    </div>
  </div>
);

const FormStep4 = ({ formData, updateForm }: FormStepProps) => (
  <div className="space-y-6">
    <h2 className="font-serif text-2xl text-organo-green mb-4">Health & Lifestyle</h2>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Sleep Quality</label>
      <select
        value={formData.sleepQuality || ""}
        onChange={(e) => updateForm("sleepQuality", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
      >
        <option value="">Select...</option>
        <option value="poor">Poor (waking frequently)</option>
        <option value="fair">Fair (some disturbances)</option>
        <option value="good">Good (usually sleep well)</option>
        <option value="excellent">Excellent (consistently great sleep)</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">
        Sleep Hours Per Night
      </label>
      <input
        type="number"
        min="3"
        max="12"
        step="0.5"
        value={formData.sleepHours || ""}
        onChange={(e) => updateForm("sleepHours", parseFloat(e.target.value))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
        placeholder="7"
      />
    </div>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Stress Level</label>
      <select
        value={formData.stressLevel || ""}
        onChange={(e) => updateForm("stressLevel", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
      >
        <option value="">Select...</option>
        <option value="low">Low (well-managed)</option>
        <option value="moderate">Moderate (normal stress)</option>
        <option value="high">High (noticeable impact)</option>
        <option value="very-high">Very High (significant impact)</option>
      </select>
    </div>
  </div>
);

const FormStep5 = ({ formData, updateForm }: FormStepProps) => (
  <div className="space-y-6">
    <h2 className="font-serif text-2xl text-organo-green mb-4">Diet & Preferences</h2>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Food Allergies</label>
      <input
        type="text"
        value={formData.allergies?.join(", ") || ""}
        onChange={(e) =>
          updateForm(
            "allergies",
            e.target.value
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a)
          )
        }
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
        placeholder="e.g., peanuts, shellfish"
      />
      <p className="text-xs text-gray-500 mt-1">Separate multiple items with commas</p>
    </div>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Food Intolerances</label>
      <input
        type="text"
        value={formData.intolerances?.join(", ") || ""}
        onChange={(e) =>
          updateForm(
            "intolerances",
            e.target.value
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a)
          )
        }
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
        placeholder="e.g., lactose, gluten"
      />
    </div>

    <div className="space-y-3">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.sugarSensitivity || false}
          onChange={(e) => updateForm("sugarSensitivity", e.target.checked)}
          className="w-5 h-5 rounded"
        />
        <span className="font-medium text-gray-700">Sugar Sensitive / Watching Intake</span>
      </label>
    </div>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Diabetes Risk</label>
      <select
        value={formData.diabetesRisk || ""}
        onChange={(e) => updateForm("diabetesRisk", e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
      >
        <option value="low">Low risk</option>
        <option value="moderate">Moderate risk</option>
        <option value="high">High risk / Type 2 diabetic</option>
      </select>
    </div>

    <div className="space-y-3">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.wantsJuiceOnly !== false}
          onChange={(e) => updateForm("wantsJuiceOnly", e.target.checked)}
          className="w-5 h-5 rounded"
        />
        <span className="font-medium text-gray-700">Juice Only (vs. Juice + Meal Suggestions)</span>
      </label>
    </div>
  </div>
);

const FormStep6 = ({ formData, updateForm }: FormStepProps) => (
  <div className="space-y-6">
    <h2 className="font-serif text-2xl text-organo-green mb-4">Medical Information</h2>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Medical Conditions</label>
      <input
        type="text"
        value={formData.medicalConditions?.join(", ") || ""}
        onChange={(e) =>
          updateForm(
            "medicalConditions",
            e.target.value
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a)
          )
        }
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
        placeholder="e.g., diabetes, hypertension, kidney disease"
      />
      <p className="text-xs text-gray-500 mt-1">Leave blank if none</p>
    </div>

    <div>
      <label className="block text-sm font-bold text-organo-green mb-2">Current Medications</label>
      <input
        type="text"
        value={formData.currentMedications?.join(", ") || ""}
        onChange={(e) =>
          updateForm(
            "currentMedications",
            e.target.value
              .split(",")
              .map((a) => a.trim())
              .filter((a) => a)
          )
        }
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-organo-green"
        placeholder="e.g., Metformin, Lisinopril"
      />
      <p className="text-xs text-gray-500 mt-1">Leave blank if not taking any</p>
    </div>

    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex gap-3">
      <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-blue-800">
        This information helps us provide safer recommendations. All data is confidential and used
        only for this assessment.
      </p>
    </div>
  </div>
);

const FormStep7 = ({ formData }: { formData: FormData }) => (
  <div className="space-y-6">
    <h2 className="font-serif text-2xl text-organo-green mb-4">Review Your Information</h2>

    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500">Goal</p>
        <p className="font-bold text-organo-green capitalize">{formData.goal?.replace("-", " ")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Age / Gender</p>
          <p className="font-bold text-gray-800">
            {formData.age}, {formData.gender || "-"}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Height / Weight</p>
          <p className="font-bold text-gray-800">
            {formData.height}cm / {formData.weight}kg
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-organo-green">
        <p className="text-sm font-bold text-organo-green flex items-center gap-2">
          <CheckCircle size={16} /> Ready to generate your personalized plan!
        </p>
      </div>
    </div>
  </div>
);

interface PlanDisplayProps {
  plan: ReturnType<typeof generatePersonalizedPlan>;
  onRestart: () => void;
  addToCart: (productId: string) => void;
  onSave: () => void;
}

const PlanDisplay = ({ plan, onRestart, addToCart, onSave }: PlanDisplayProps) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
    <div className="text-center mb-12">
      <h1 className="font-serif text-4xl md:text-6xl text-organo-green mb-4">
        Your Personal Juice Plan
      </h1>
      <p className="text-organo-gray text-lg">
        Customized for {plan.userProfile.goal.replace("-", " ")}
      </p>
    </div>

    {/* Safety Alerts */}
    {plan.safetyNotes.length > 0 && (
      <div className="max-w-4xl mx-auto mb-8 space-y-3">
        {plan.safetyNotes.map((note: string, idx: number) => (
          <div
            key={idx}
            className={`p-4 rounded-lg flex gap-3 ${
              note.includes("⚠️")
                ? "bg-amber-50 border border-amber-200"
                : note.includes("✓")
                  ? "bg-green-50 border border-green-200"
                  : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex-shrink-0">
              {note.includes("⚠️") && <AlertCircle className="text-amber-600" size={20} />}
              {note.includes("✓") && <CheckCircle className="text-green-600" size={20} />}
              {note.includes("ℹ️") && <Info className="text-blue-600" size={20} />}
            </div>
            <p className="text-sm">{note.substring(note.search(/[A-Z]/))}</p>
          </div>
        ))}
      </div>
    )}

    {/* Daily Plan */}
    <div className="max-w-4xl mx-auto mb-12">
      <h2 className="font-serif text-3xl text-organo-green mb-6">Your Daily Juice Plan</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {plan.juices.map((rec: JuicePlanRecommendation, idx: number) => (
          <motion.div
            key={rec.juice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-organo-green p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-wider">{rec.timing}</p>
              <p className="font-serif text-xl">{rec.juice.name}</p>
            </div>

            <div className="h-40 bg-organo-cream overflow-hidden">
              <img
                src={rec.juice.image}
                alt={rec.juice.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5">
              <p className="text-xs text-gray-500 mb-3">{rec.whyItMatches}</p>

              <div className="mb-4">
                <p className="text-xs font-bold text-organo-green mb-2">Key Benefits:</p>
                <ul className="space-y-1">
                  {rec.benefits.map((b: string) => (
                    <li key={b} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-organo-pistachio">•</span> {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500">
                  <strong>Serving:</strong> {rec.servingSize} |{" "}
                  <strong>~{rec.caloriesApprox} cal</strong>
                </p>
              </div>

              <button
                onClick={() => addToCart(rec.juice.id.toString())}
                className="w-full bg-organo-green text-white text-xs font-bold py-2 rounded-lg hover:bg-organo-green/90 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Why This Plan Works */}
    <div className="max-w-4xl mx-auto mb-12 bg-gradient-to-br from-organo-green/10 to-emerald-50 p-8 rounded-2xl border border-organo-green/20">
      <h3 className="font-serif text-2xl text-organo-green mb-4">Why This Plan Works For You</h3>
      <p className="text-gray-700 leading-relaxed">{plan.whyThisPlanWorks}</p>
    </div>

    {/* Hydration & Tips */}
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-3">💧 Hydration Target</h3>
        <p className="text-blue-800">{plan.hydrationTarget}</p>
      </div>

      <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
        <h3 className="font-bold text-amber-900 mb-3">⏰ Daily Contribution</h3>
        <p className="text-amber-800">~{plan.dailyCalorieContribution} calories from juices</p>
      </div>
    </div>

    {/* Adjustment Tips */}
    <div className="max-w-4xl mx-auto mb-12">
      <h3 className="font-serif text-2xl text-organo-green mb-6">Optimization Tips</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {plan.adjustmentTips.map((tip: string, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-4 rounded-lg shadow flex gap-3"
          >
            <span className="text-2xl flex-shrink-0">{tip.charAt(0)}</span>
            <p className="text-sm text-gray-700">{tip.slice(2)}</p>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Meal Suggestions */}
    {plan.mealSuggestions && (
      <div className="max-w-4xl mx-auto mb-12">
        <h3 className="font-serif text-2xl text-organo-green mb-6">Meal Pairing Suggestions</h3>
        <div className="space-y-3">
          {plan.mealSuggestions.map((meal: string, idx: number) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-700">{meal}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Action Buttons */}
    <div className="max-w-4xl mx-auto flex gap-4 justify-center">
      <button
        onClick={onRestart}
        className="px-6 py-3 border-2 border-organo-green text-organo-green font-bold rounded-lg hover:bg-organo-green/10 transition-all"
      >
        Create New Plan
      </button>
      <button
        onClick={onSave}
        className="px-6 py-3 bg-organo-green text-white font-bold rounded-lg hover:bg-organo-green/90 transition-all"
      >
        Save to Account
      </button>
    </div>
  </motion.div>
);
