# Configuration Auto Action Beds24 pour Zoho CRM

Pour envoyer automatiquement les nouvelles réservations vers votre Webhook (Make.com ou Zoho Flow), configurez une **Auto Action** dans Beds24.

## 1. Créer l'Auto Action

Allez dans **Settings > Guest Management > Auto Actions** et créez une nouvelle action.

- **Trigger** : `Booking` (ou `New Booking` selon votre version)
- **Auto Action** : `Request URL`

## 2. Configuration de la requête

Remplissez les champs suivants :

- **URL** : Collez ici l'URL de votre Webhook Make.com ou Zoho Flow.
- **HTTP Method** : `POST`
- **Data (JSON)** : Copiez-collez le bloc JSON ci-dessous.

```json
{
  "bookingId": "[BOOKID]",
  "propId": "[PROPID]",
  "status": "[STATUS]",
  "dates": {
    "auditDate": "[BDATE]",
    "arrival": "[ARRIVAL]",
    "departure": "[DEPARTURE]"
  },
  "guest": {
    "firstName": "[GUESTFIRSTNAME]",
    "lastName": "[GUESTNAME]",
    "email": "[GUESTEMAIL]",
    "phone": "[GUESTPHONE]",
    "address": "[GUESTADDRESS]",
    "city": "[GUESTCITY]",
    "country": "[GUESTCOUNTRY]",
    "postcode": "[GUESTPOSTCODE]"
  },
  "pricing": {
    "price": "[PRICE]",
    "currency": "[CURRENCY]",
    "deposit": "[DEPOSIT]"
  },
  "occupancy": {
    "numAdult": "[NUMADULT]",
    "numChild": "[NUMCHILD]"
  },
  "notes": "[NOTES]"
}
```

## 3. Déclenchement

Assurez-vous que l'action est activée (**Enable**).
Dès qu'une réservation est créée ou modifiée (selon vos réglages de trigger), Beds24 enverra ce JSON à votre Webhook.
