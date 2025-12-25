import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-primary font-medium mb-4 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-foreground">About JMS</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <section className="space-y-8">
          {/* Overview */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              📦 What is JMS Shortage Counter?
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              JMS Shortage Counter is a simple, easy-to-use app designed for small and rural stores. It helps shopkeepers quickly note down products that are out of stock and track their ordering status.
            </p>
            <p className="text-foreground leading-relaxed">
              No login needed. No complicated forms. Just add what's missing, mark when you've ordered, and confirm when it arrives.
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              ✨ Key Features
            </h2>
            <ul className="space-y-3">
              {[
                "Add products to track shortages",
                "Organize products into categories (by supplier, type, etc.)",
                "Track status: Pending, Ordered, Delivered",
                "Search with spelling tolerance (find items even with typos)",
                "No login required - shared across all devices",
                "Simple, mobile-friendly design",
                "Works on low-end phones",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg flex-shrink-0">
                    ✓
                  </span>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to Use */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              🎯 How to Use
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "View All Shortages",
                  desc: "Open the app and see all products under 'All' by default.",
                },
                {
                  step: "2",
                  title: "Create Categories",
                  desc: 'Tap "Categories" to create groups like "Groceries", "Dairy", etc. Organize by supplier to make ordering easier.',
                },
                {
                  step: "3",
                  title: "Add a Product",
                  desc: 'Tap the "+" button to add a new shortage. Type the product name, select a category, and set the initial status.',
                },
                {
                  step: "4",
                  title: "Track Status",
                  desc: 'Each product has three buttons: Pending 🟡, Ordered 🔵, Delivered 🟢. Tap to update as the order progresses.',
                },
                {
                  step: "5",
                  title: "Confirm Delivery",
                  desc: "When you mark as Delivered, the app asks for confirmation, then removes the product from the list.",
                },
                {
                  step: "6",
                  title: "Search",
                  desc: "Use the search bar to find products quickly. The search is forgiving - even small spelling mistakes are okay.",
                },
              ].map((item, idx) => (
                <div key={idx} className="border-l-4 border-primary pl-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-bold text-primary bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Principles */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              💡 Core Principles
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { icon: "🚀", title: "Super Simple", desc: "Big buttons, minimal text, easy for everyone" },
                {
                  icon: "📱",
                  title: "Mobile First",
                  desc: "Works great on old phones",
                },
                {
                  icon: "🌐",
                  title: "Shared Instantly",
                  desc: "No login, one source of truth",
                },
                {
                  icon: "💾",
                  title: "No Data Loss",
                  desc: "You delete products, never automatic",
                },
                {
                  icon: "🔍",
                  title: "Forgiving Search",
                  desc: "Find items even with typos",
                },
                {
                  icon: "🤝",
                  title: "Rural-Friendly",
                  desc: "Designed with shopkeepers in mind",
                },
              ].map((principle, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-border p-4"
                >
                  <div className="text-3xl mb-2">{principle.icon}</div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {principle.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-3">💬 Remember</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li>
                • <strong>"All"</strong> shows everything - it's not a category you can delete
              </li>
              <li>
                • <strong>Deleting a category</strong> doesn't delete products - they move to "All"
              </li>
              <li>
                • <strong>Confirming delivery</strong> removes the product permanently
              </li>
              <li>
                • <strong>No backup</strong> - data is stored locally and shared across devices
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm mb-4">
              JMS Shortage Counter v1.0
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Back to Home
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
