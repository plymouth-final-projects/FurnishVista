'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { User, Palette, Keyboard, Bell, Save, Moon, Sun, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/states/useAuthStore';
import { useUIStore } from '@/states/useUIStore';
import { KEYBOARD_SHORTCUTS } from '@/lib/constants';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay },
});

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { setOnboardingComplete } = useUIStore();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U';

  function handleSaveProfile() {
    updateUser({ name, email });
    toast.success('Profile updated', { description: 'Your changes have been saved' });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Page header */}
      <motion.div {...fadeUp(0)}>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account and application preferences
        </p>
      </motion.div>

      {/* ── Profile ─────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.08)}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Profile</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar summary row */}
            <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
              <Avatar className="h-14 w-14 shrink-0">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold">{user?.name ?? 'Designer'}</p>
                <p className="truncate text-sm text-muted-foreground">{user?.email ?? ''}</p>
                <Badge variant="secondary" className="mt-1 text-xs capitalize">
                  {user?.role ?? 'designer'}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Editable fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settings-name">Full Name</Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">Email Address</Label>
                <Input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} className="gap-2">
                <Save className="h-4 w-4" />
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Appearance ──────────────────────────────────────── */}
      <motion.div {...fadeUp(0.16)}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Palette className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Appearance</CardTitle>
                <CardDescription>Customise how FurnishVista looks</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="divide-y">
            {/* Dark mode toggle */}
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                {isDark
                  ? <Moon className="h-4 w-4 text-muted-foreground" />
                  : <Sun className="h-4 w-4 text-muted-foreground" />}
                <div>
                  <p className="text-sm font-medium">Theme</p>
                  <p className="text-xs text-muted-foreground">
                    {isDark ? 'Dark mode is active' : 'Light mode is active'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                suppressHydrationWarning
                className="relative flex h-6 w-11 items-center rounded-full border border-border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className={`absolute inset-0 rounded-full transition-colors duration-200 ${isDark ? 'bg-primary' : 'bg-muted'}`} />
                <span className={`relative flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-200 ${isDark ? 'translate-x-5.5' : 'translate-x-px'}`}>
                  {isDark
                    ? <Moon className="h-3 w-3 text-primary" />
                    : <Sun className="h-3 w-3 text-muted-foreground" />}
                </span>
              </button>
            </div>

            {/* Reset onboarding */}
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Welcome Tour</p>
                  <p className="text-xs text-muted-foreground">
                    Replay the onboarding tour in the editor
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOnboardingComplete(false);
                  toast.success('Tour reset', {
                    description: 'The tour will show next time you open the editor',
                  });
                }}
              >
                Reset tour
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Notifications ───────────────────────────────────── */}
      <motion.div {...fadeUp(0.24)}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>Control alerts and feedback sounds</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="divide-y">
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Toast notifications</p>
                  <p className="text-xs text-muted-foreground">Show confirmation messages for actions</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={(checked) => {
                  setNotifications(checked);
                  toast.success(checked ? 'Notifications enabled' : 'Notifications disabled');
                }}
                aria-label="Toggle toast notifications"
              />
            </div>
            <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Sound effects</p>
                  <p className="text-xs text-muted-foreground">Play audio feedback for actions</p>
                </div>
              </div>
              <Switch
                checked={soundEffects}
                onCheckedChange={(checked) => {
                  setSoundEffects(checked);
                  toast.success(checked ? 'Sounds enabled' : 'Sounds disabled');
                }}
                aria-label="Toggle sound effects"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Keyboard Shortcuts ──────────────────────────────── */}
      <motion.div {...fadeUp(0.32)}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Keyboard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
                <CardDescription>Quick reference for the editor</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1 sm:grid-cols-2">
              {KEYBOARD_SHORTCUTS.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted/50"
                >
                  <span className="text-muted-foreground">{shortcut.action}</span>
                  <kbd className="rounded border bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
