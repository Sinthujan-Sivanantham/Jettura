# 🔐 Google OAuth Anmeldung einrichten - Komplette Anleitung

Diese Anleitung zeigt dir Schritt für Schritt, wie du die Google-Anmeldung für deine Jettura-App einrichtest.

---

## 📋 Übersicht

Die Google-Anmeldung ist bereits in deiner App implementiert! Du musst nur noch die OAuth-Credentials in Google Cloud Console erstellen und in Supabase konfigurieren.

---

## 🚀 Teil 1: Google Cloud Console Setup

### Schritt 1: Google Cloud Projekt erstellen

1. **Öffne**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Melde dich an** mit deinem Google-Konto
3. **Klicke oben links** auf das Projekt-Dropdown
4. **Klicke auf** "Neues Projekt"
5. **Projektname**: `Jettura` (oder einen Namen deiner Wahl)
6. **Klicke auf** "Erstellen"
7. **Warte** bis das Projekt erstellt wurde (ca. 30 Sekunden)

### Schritt 2: OAuth-Zustimmungsbildschirm konfigurieren

1. **Wähle dein Projekt** aus dem Dropdown oben
2. **Navigiere zu**: `APIs & Services` → `OAuth consent screen` (linkes Menü)
3. **Wähle**: `External` (für öffentliche Nutzer)
4. **Klicke auf** "Erstellen"

#### Zustimmungsbildschirm ausfüllen:

**App-Informationen:**
- **App name**: `Jettura Travelagent`
- **User support email**: Deine E-Mail-Adresse
- **App logo**: (Optional) Lade dein Jettura-Logo hoch

**App-Domain:**
- **Application home page**: `http://localhost:4000` (später deine Production-URL)
- **Application privacy policy link**: `http://localhost:4000/privacy` (optional)
- **Application terms of service link**: `http://localhost:4000/terms` (optional)

**Authorized domains:**
- `supabase.co`
- `localhost` (für lokale Entwicklung)

**Developer contact information:**
- Deine E-Mail-Adresse

5. **Klicke auf** "Speichern und fortfahren"

#### Scopes (Berechtigungen):

6. **Klicke auf** "Add or Remove Scopes"
7. **Wähle folgende Scopes**:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
8. **Klicke auf** "Update"
9. **Klicke auf** "Speichern und fortfahren"

#### Test users (nur für Development):

10. **Klicke auf** "Add Users"
11. **Füge deine Test-E-Mail-Adressen hinzu** (z.B. deine eigene Gmail-Adresse)
12. **Klicke auf** "Speichern und fortfahren"
13. **Klicke auf** "Zurück zum Dashboard"

### Schritt 3: OAuth 2.0 Client ID erstellen

1. **Navigiere zu**: `APIs & Services` → `Credentials` (linkes Menü)
2. **Klicke auf** "+ CREATE CREDENTIALS" (oben)
3. **Wähle**: "OAuth client ID"

#### Client ID konfigurieren:

4. **Application type**: `Web application`
5. **Name**: `Jettura Web Client`

**Authorized JavaScript origins:**
- `http://localhost:4000`
- `https://kkbsaplhjcsqtycmstxl.supabase.co`
- (Später) Deine Production-Domain (z.B. `https://jettura.com`)

**Authorized redirect URIs:**
- `https://kkbsaplhjcsqtycmstxl.supabase.co/auth/v1/callback`
- `http://localhost:4000`

6. **Klicke auf** "Erstellen"

### Schritt 4: Credentials kopieren

Nach dem Erstellen erscheint ein Popup mit deinen Credentials:

- **Client ID**: `123456789-abc...apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-...`

⚠️ **WICHTIG**: Kopiere beide Werte sofort! Du brauchst sie im nächsten Schritt.

---

## 🗄️ Teil 2: Supabase Konfiguration

### Schritt 1: Supabase Dashboard öffnen

1. **Öffne**: [Dein Supabase Projekt](https://supabase.com/dashboard/project/kkbsaplhjcsqtycmstxl)
2. **Melde dich an** mit deinem Supabase-Account

### Schritt 2: Google Provider aktivieren

1. **Navigiere zu**: `Authentication` → `Providers` (linkes Menü)
2. **Scrolle zu** "Google" in der Provider-Liste
3. **Klicke auf** "Google" um die Einstellungen zu öffnen

### Schritt 3: Google OAuth konfigurieren

1. **Enabled**: Schalte den Toggle auf `ON` ✅
2. **Client ID**: Füge die Client ID aus Google Cloud Console ein
3. **Client Secret**: Füge das Client Secret aus Google Cloud Console ein

**Zusätzliche Einstellungen (optional):**
- **Redirect URL**: Wird automatisch angezeigt: `https://kkbsaplhjcsqtycmstxl.supabase.co/auth/v1/callback`
- **Skip nonce check**: Lasse dies deaktiviert (empfohlen)

4. **Klicke auf** "Save" (unten rechts)

### Schritt 4: Redirect URL in Google eintragen

⚠️ **Wichtig**: Gehe zurück zur Google Cloud Console und stelle sicher, dass diese URL in den Authorized redirect URIs steht:

```
https://kkbsaplhjcsqtycmstxl.supabase.co/auth/v1/callback
```

---

## ✅ Teil 3: Testen der Google-Anmeldung

### Lokaler Test:

1. **Starte deine App**: `npm run dev` (läuft bereits auf Port 4000)
2. **Öffne**: http://localhost:4000
3. **Klicke auf** "Login" in der Navbar
4. **Klicke auf** den **Google-Button** (mit Google-Icon)
5. **Du wirst zu Google weitergeleitet**
6. **Wähle dein Google-Konto** aus
7. **Erlaube die Berechtigungen** (Email, Profil)
8. **Du wirst zurück zur App geleitet** und bist eingeloggt! 🎉

### Was passiert im Hintergrund:

1. ✅ Supabase erstellt automatisch einen User in der `auth.users` Tabelle
2. ✅ Dein `AuthContext` erkennt den eingeloggten User
3. ✅ Ein Profil wird in der `profiles` Tabelle erstellt (durch Supabase Trigger)
4. ✅ Avatar-URL wird von Google übernommen
5. ✅ Du wirst zur Startseite weitergeleitet

---

## 🔧 Troubleshooting

### Problem: "Access blocked: This app's request is invalid"

**Lösung**: 
- Überprüfe, ob die Redirect URI in Google Cloud Console korrekt ist
- Stelle sicher, dass `supabase.co` in den Authorized domains steht

### Problem: "Error 400: redirect_uri_mismatch"

**Lösung**:
- Die Redirect URI in Google Cloud Console muss EXAKT so lauten:
  ```
  https://kkbsaplhjcsqtycmstxl.supabase.co/auth/v1/callback
  ```
- Keine Leerzeichen, keine zusätzlichen Slashes

### Problem: "This app is blocked"

**Lösung**:
- Du bist nicht als Test-User eingetragen
- Gehe zu Google Cloud Console → OAuth consent screen → Test users
- Füge deine E-Mail-Adresse hinzu

### Problem: "Database error saving new user"

**Lösung**:
- Lösche alte/fehlerhafte User-Einträge in Supabase:
  1. Gehe zu `Authentication` → `Users`
  2. Lösche den fehlerhaften User
  3. Gehe zu `Table Editor` → `profiles`
  4. Lösche das zugehörige Profil
  5. Versuche die Anmeldung erneut

### Problem: User wird erstellt, aber kein Profil

**Lösung**:
- Überprüfe ob der Supabase Trigger existiert:
  ```sql
  -- Führe diese SQL-Query in Supabase SQL Editor aus:
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```
- Falls nicht vorhanden, erstelle den Trigger:
  ```sql
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, avatar_url, created_at)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'avatar_url',
      NOW()
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  ```

---

## 🎨 Anpassungen (Optional)

### Google-Button Text ändern:

In `src/components/auth/shared/SocialAuthButtons.jsx`:

```jsx
// Zeile 18 - Ändere den Text
<span className="mt-0.5">Mit Google anmelden</span>
```

### Redirect nach Login ändern:

In `src/components/auth/LoginForm.jsx`:

```jsx
// Zeile 49 - Ändere die Redirect-URL
redirectTo: window.location.origin + '/dashboard', // statt nur origin
```

---

## 📱 Production Deployment

Wenn du deine App später live schaltest:

### 1. Google Cloud Console aktualisieren:

**Authorized JavaScript origins:**
- Füge hinzu: `https://deine-domain.com`

**Authorized redirect URIs:**
- Behalte: `https://kkbsaplhjcsqtycmstxl.supabase.co/auth/v1/callback`

### 2. OAuth Consent Screen auf "Production" setzen:

1. Gehe zu `OAuth consent screen`
2. Klicke auf "Publish App"
3. Warte auf Google's Verifizierung (kann 1-2 Wochen dauern)

### 3. Supabase Custom Domain (optional):

Falls du eine Custom Domain für Supabase verwendest:
- Aktualisiere die Redirect URI in Google Cloud Console entsprechend

---

## 📚 Weitere Ressourcen

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)

---

## ✨ Fertig!

Deine Google-Anmeldung sollte jetzt funktionieren! 🎉

Bei Fragen oder Problemen, melde dich einfach!
