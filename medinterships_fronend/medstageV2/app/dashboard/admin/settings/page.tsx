"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Lock, Database, Globe, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";

// 🔹 Types pour les éléments de configuration
type BaseItem = {
  label: string;
  key: keyof SettingsState;
};

type InputItem = BaseItem & {
  type: "input";
  value: string;
};

type SelectOption = { label: string; value: string };

type SelectItem = BaseItem & {
  type: "select";
  value: string;
  options: SelectOption[];
};

type ToggleItem = BaseItem & {
  type: "toggle";
  value: boolean;
  description: string;
};

type SettingsItem = InputItem | SelectItem | ToggleItem;

type SettingsState = {
  platformName: string;
  platformEmail: string;
  platformPhone: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  userRegistration: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  apiEnabled: boolean;
};

// 🔹 Fonctions utilitaires (simulées)
const saveSettings = () => new Promise((r) => setTimeout(r, 600));
const resetAllSettings = () => new Promise((r) => setTimeout(r, 600));

export default function SettingsPage() {
  const { t } = useLanguage();

  const initialSettings: SettingsState = {
    platformName: "MediStage",
    platformEmail: "admin@medistage.dz",
    platformPhone: "+213 555 123 456",
    timezone: "Africa/Algiers",
    language: "fr",
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    apiEnabled: true,
  };

  const [settings, setSettings] = useState<SettingsState>({ ...initialSettings });
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState("sk_live_51a2b3c4d5e6f7g8h9i0j");
  const [isResetting, setIsResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    if (copyMessage) {
      const timer = setTimeout(() => setCopyMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyMessage]);

  useEffect(() => {
    if (resetMessage) {
      const timer = setTimeout(() => setResetMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [resetMessage]);

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = (key: keyof SettingsState, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCancel = () => {
    setSettings({ ...initialSettings });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
      setCopyMessage("Paramètres enregistrés !");
    } catch {
      setCopyMessage("Erreur lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopyMessage(t("settings.copied") || "Clé copiée !");
    } catch {
      setCopyMessage("Échec de la copie.");
    }
  };

  const confirmReset = async () => {
    setIsResetting(true);
    try {
      await resetAllSettings();
      setSettings({ ...initialSettings });
      setResetMessage("Paramètres réinitialisés !");
    } catch {
      setCopyMessage("Échec de la réinitialisation.");
    } finally {
      setIsResetting(false);
    }
  };

  // 🔹 Sections typées
  const sections: Array<{
    title: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    items: SettingsItem[];
  }> = [
    {
      title: t("settings.general"),
      icon: Globe,
      items: [
        { type: "input", label: t("settings.platformName"), key: "platformName", value: settings.platformName },
        { type: "input", label: t("settings.platformEmail"), key: "platformEmail", value: settings.platformEmail },
        { type: "input", label: t("settings.platformPhone"), key: "platformPhone", value: settings.platformPhone },
        {
          type: "select",
          label: t("settings.timezone"),
          key: "timezone",
          value: settings.timezone,
          options: [
            { label: "Africa/Algiers", value: "Africa/Algiers" },
            { label: "Europe/Paris", value: "Europe/Paris" },
            { label: "UTC", value: "UTC" },
          ],
        },
        {
          type: "select",
          label: t("settings.language"),
          key: "language",
          value: settings.language,
          options: [
            { label: t("lang.french"), value: "fr" },
            { label: t("lang.english"), value: "en" },
            { label: t("lang.arabic"), value: "ar" },
          ],
        },
      ],
    },
    {
      title: t("settings.security"),
      icon: Lock,
      items: [
        {
          type: "toggle",
          label: t("settings.maintenanceMode"),
          key: "maintenanceMode",
          value: settings.maintenanceMode,
          description: t("settings.maintenanceDesc"),
        },
        {
          type: "toggle",
          label: t("settings.registration"),
          key: "userRegistration",
          value: settings.userRegistration,
          description: t("settings.registrationDesc"),
        },
      ],
    },
    {
      title: t("settings.notifications"),
      icon: Bell,
      items: [
        {
          type: "toggle",
          label: t("settings.emailNotif"),
          key: "emailNotifications",
          value: settings.emailNotifications,
          description: t("settings.emailNotifDesc"),
        },
        {
          type: "toggle",
          label: t("settings.smsNotif"),
          key: "smsNotifications",
          value: settings.smsNotifications,
          description: t("settings.smsNotifDesc"),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">{t("settings.title")}</h2>
        <p className="text-muted-foreground mt-1">{t("settings.description")}</p>
      </div>

      {copyMessage && (
        <div className="p-3 rounded-lg bg-green-100 text-green-800 text-sm font-medium border border-green-200">
          {copyMessage}
        </div>
      )}
      {resetMessage && (
        <div className="p-3 rounded-lg bg-blue-100 text-blue-800 text-sm font-medium border border-blue-200">
          {resetMessage}
        </div>
      )}

      <div className="space-y-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <Card key={idx} className="p-6 border-border/50">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                <Icon size={24} className="text-primary" />
                <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
              </div>
              <div className="space-y-6">
                {section.items.map((item, i) => (
                  <div key={i}>
                    {item.type === "input" && (
                      <div>
                        <Label className="text-foreground">{item.label}</Label>
                        <Input
                          value={item.value}
                          onChange={(e) => handleInputChange(item.key, e.target.value)}
                          className="mt-2 bg-card/50 border-border"
                        />
                      </div>
                    )}
                    {item.type === "select" && (
                      <div>
                        <Label className="text-foreground">{item.label}</Label>
                        <Select
                          value={item.value}
                          onValueChange={(value) => handleInputChange(item.key, value)}
                        >
                          <SelectTrigger className="mt-2 bg-card/50 border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {item.options.map((opt, j) => (
                              <SelectItem key={j} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {item.type === "toggle" && (
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <Switch
                          checked={item.value}
                          onCheckedChange={() => handleToggle(item.key)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {/* API Section */}
        <Card className="p-6 border-border/50">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
            <Database size={24} className="text-primary" />
            <h3 className="text-xl font-semibold text-foreground">{t("settings.api")}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-foreground">{t("settings.apiPublic")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("settings.apiPublicDesc")}</p>
              </div>
              <Switch
                checked={settings.apiEnabled}
                onCheckedChange={() => handleToggle("apiEnabled")}
              />
            </div>
            {settings.apiEnabled && (
              <div className="mt-6 p-4 rounded-lg border border-border/50 bg-card/30">
                <Label className="text-foreground">{t("settings.apiKey")}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    readOnly
                    className="bg-card/50 border-border font-mono text-sm flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => setShowApiKey(!showApiKey)} className="bg-transparent">
                    {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent" onClick={copyApiKey}>
                    {t("settings.copy")}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t("settings.apiWarning")}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200/50 bg-red-50/20 dark:bg-red-900/10">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4">{t("settings.danger")}</h3>
          <div className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent">
                  <Trash2 size={18} />
                  {t("settings.reset")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("settings.confirmReset")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("settings.resetWarning")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogCancel>{t("settings.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={confirmReset} className="bg-red-600 hover:bg-red-700" disabled={isResetting}>
                  {isResetting ? "Réinitialisation..." : t("settings.reset")}
                </AlertDialogAction>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      </div>

      <div className="flex justify-end gap-3  bottom-4">
        <Button variant="outline" onClick={handleCancel} className="bg-transparent">
          {t("settings.cancel")}
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-primary to-accent hover:shadow-lg gap-2">
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t("settings.saving")}
            </>
          ) : (
            <>
              <Save size={18} />
              {t("settings.save")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}