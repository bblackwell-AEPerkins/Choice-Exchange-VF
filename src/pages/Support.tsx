import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSupportChat } from "@/hooks/useSupportChat";
import { cn } from "@/lib/utils";
import {
  Send,
  Loader2,
  Trash2,
  MessageCircle,
  FileText,
  CreditCard,
  Users,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

const quickTopics = [
  { icon: HelpCircle, label: "What is ICHRA?", question: "What is ICHRA and how does it work?" },
  { icon: FileText, label: "Submit a Claim", question: "How do I submit a reimbursement claim?" },
  { icon: CreditCard, label: "My Allowance", question: "How do I check my monthly allowance and usage?" },
  { icon: Users, label: "Find Provider", question: "How do I find an in-network provider?" },
];

const faqItems = [
  { question: "How do I enroll in a plan?", answer: "Go to your Member Dashboard, click the 'My Enrollment' tab, and browse available plans. You can compare up to 3 plans and select the one that fits your needs." },
  { question: "What expenses are covered by ICHRA?", answer: "ICHRA covers individual health insurance premiums, dental and vision premiums, prescription medications, doctor visits, lab tests, mental health services, and some OTC medications." },
  { question: "How long do reimbursements take?", answer: "Reimbursements are typically processed within 5-7 business days after your claim is approved." },
  { question: "Can I change my plan mid-year?", answer: "You can change plans during open enrollment (typically Nov-Jan) or after a qualifying life event like marriage, birth, or job change." },
];

export default function Support() {
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage, clearMessages } = useSupportChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleQuickTopic = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Support Center</h1>
          <p className="mt-2 text-muted-foreground">
            Get instant answers from our AI assistant or browse common topics
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <Card className="flex h-[600px] flex-col">
              <CardHeader className="flex-row items-center justify-between border-b bg-primary text-primary-foreground rounded-t-lg">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-lg">HealthNex Assistant</CardTitle>
                    <p className="text-sm opacity-90">Ask me anything about your benefits</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={clearMessages}
                  disabled={messages.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex flex-1 flex-col p-0">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <div className="space-y-6">
                      <div className="rounded-lg bg-muted p-4">
                        <p className="font-medium">👋 Welcome to HealthNex Support!</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          I can help you with ICHRA questions, enrollment, claims, finding providers, 
                          and understanding your benefits. What would you like to know?
                        </p>
                      </div>
                      
                      <div>
                        <p className="mb-3 text-sm font-medium text-muted-foreground">Popular topics:</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {quickTopics.map((topic) => (
                            <button
                              key={topic.label}
                              onClick={() => handleQuickTopic(topic.question)}
                              className="flex items-center gap-3 rounded-lg border bg-background p-3 text-left transition-colors hover:bg-muted"
                            >
                              <topic.icon className="h-5 w-5 text-primary" />
                              <span className="text-sm font-medium">{topic.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-3",
                            msg.role === "user"
                              ? "ml-auto bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                        </div>
                      ))}
                      {isLoading && messages[messages.length - 1]?.role === "user" && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      )}
                    </div>
                  )}
                  {error && (
                    <div className="mt-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                </ScrollArea>

                <form onSubmit={handleSubmit} className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your question..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((faq, i) => (
                  <div key={i} className="space-y-1">
                    <button
                      onClick={() => handleQuickTopic(faq.question)}
                      className="flex w-full items-center justify-between text-left text-sm font-medium hover:text-primary"
                    >
                      {faq.question}
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </button>
                    <p className="text-xs text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> support@healthnex.com</p>
                  <p><strong>Phone:</strong> 1-800-HEALTHNEX</p>
                  <p><strong>Hours:</strong> Mon-Fri 8am-8pm EST</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-4">
                <p className="font-medium">Ready to explore your benefits?</p>
                <p className="mt-1 text-sm opacity-90">
                  Visit your dashboard to view coverage, submit claims, and more.
                </p>
                <Button asChild variant="secondary" className="mt-3 w-full">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
