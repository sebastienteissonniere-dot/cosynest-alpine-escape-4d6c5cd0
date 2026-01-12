# Configuration des Actions Zoho Flow (Beds24 vers Zoho CRM)

**Méthode compatible sans champs personnalisés.**
Nous allons utiliser le **Nom de l'Affaire** pour stocker l'ID de réservation et le retrouver.

**Convention de nommage obligatoire** : `Résa #[BOOKID] - [Nom du Guest]`
*(Il est crucial de garder le `#` et l'ID au début ou dans un format fixe)*

---

## Étape 1 : Créer ou Mettre à jour le Contact (Client)

*Identique à la version précédente.*
1.  Action **Zoho CRM > Create or Update Module Entry**.
2.  **Module** : `Contacts`.
3.  **Duplicate Check Field** : `Email`.

## Étape 2 : Chercher l'Affaire existante (Script)

Puisque nous ne pouvons pas utiliser de champ unique, nous allons utiliser un petit script pour chercher par nom.

1.  Ajoutez un bloc **Logic > Custom Function**.
2.  Nommez-la `SearchDealByBookingId`.
3.  Créez une variable d'entrée (input) : `bookingId` (String).
4.  Copiez-collez ce code **Deluge** :

```deluge
// Chercher une affaire dont le nom contient l'ID beds24
searchCriteria = "(Deal_Name:starts_with:Résa #" + bookingId + ")";
deals = zoho.crm.searchRecords("Deals", searchCriteria);

if (deals.size() > 0) {
    // On retourne l'ID de la première affaire trouvée
    return deals.get(0).get("id");
}
return null;
```

5.  **Testez** la fonction dans l'éditeur (vous pouvez mettre "12345" en test, ça retournera null, c'est normal).
6.  **Sauvegardez**.
7.  Mappez la variable d'entrée `bookingId` avec la données du trigger Beds24 `bookingId`.

## Étape 3 : Décision

1.  Ajoutez un bloc **Logic > Decision**.
2.  **Condition** : `[SearchDealByBookingId]` **is not null**.
3.  Branche "Existe".

## Étape 4 : Branche "Existe" -> Mettre à jour

1.  Action **Zoho CRM > Update Module Entry**.
2.  **Module** : `Deals`.
3.  **Entry ID** : `[SearchDealByBookingId]` (Résultat de la fonction).
4.  **Champs** : Mettez à jour le montant, les dates, etc.

## Étape 5 : Branche "N'existe pas" -> Créer

1.  Action **Zoho CRM > Create Module Entry**.
2.  **Module** : `Deals`.
3.  **Deal Name** : `Résa #[bookingId] - [guest.lastName]`
    *   **ATTENTION** : Vous DEVEZ respecter ce format `Résa #[bookingId]...` pour que la recherche (étape 2) fonctionne la prochaine fois.
4.  **Amount** : `pricing.price`.
5.  **Stage** : "Closed Won".
6.  **Contact Name** : ID du contact (étape 1).

---

### Résumé
1.  **Trigger** Beds24.
2.  **Upsert** Contact.
3.  **Custom Function** (Cherche "Résa #[ID]").
4.  **Decision** (Trouvé ?).
    *   **OUI** : Update (avec l'ID retourné par la fonction).
    *   **NON** : Create (avec le nom "Résa #[ID]...").
