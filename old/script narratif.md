
## 2. Le Script Narratif (30 min chrono)

_Matériel requis : Laptop, VS Code ouvert, Repo cloné, Extension LikeC4 installée, Navigateur ouvert sur localhost, Copilot activé._
### Script Narratif : "Ne dessinez plus vos architectures : codez-les !"

**Durée totale de parole : 30 min** (suivi de 15 min de Q&A).

#### 00:00 - 05:00 : L'Introduction (Le Constat)

- **Visuel :** Slide 1. Une photo d'un tableau blanc illisible avec la mention "V1 - Janvier" et à côté un document Confluence poussiéreux.
	
- **Accroche :**
	
	- "On a tous ce dessin. Celui qu'on a fait avec passion au début du projet. On était fiers, c'était clair. Aujourd'hui ? Il est archivé quelque part, et le code a tellement divergé qu'on a peur de le regarder."
		
- **Le message clé :**
	
	- "Le problème, ce n'est pas de dessiner. C'est que dès qu'on exporte en PNG, l'information meurt. Elle devient statique."
		
	- "En 2025, on n'accepte plus de gérer notre infrastructure manuellement (on fait du Terraform), pourquoi accepte-t-on encore de cliquer pour nos schémas ?"
		
- **Transition :** "Ce que je vous propose aujourd'hui, c'est de traiter l'architecture comme du code. De la versionner, de la compiler, et de la rendre vivante."
	

#### 05:00 - 09:00 : La Méthode (C4 & LikeC4)

- **Visuel :** Slide 2. Analogie Google Maps (Monde > Ville > Bâtiment).
	
- **Discours :**
	
	- "Pas besoin d'être un expert UML. On va utiliser le modèle C4. Imaginez Google Maps :"
		
		- **Zoom arrière :** Le Système (La vue satellite).
			
		- **Zoom intermédiaire :** Les Conteneurs (La vue plan de ville : API, DB, Front).
			
		- **Zoom avant :** Les Composants (Le bâtiment).
			
	- "L'outil du jour s'appelle **LikeC4**. Il ne sert pas juste à 'dessiner', il sert à modéliser. On définit des _objets_ et des _relations_, et c'est lui qui calcule le dessin."
		

#### 09:00 - 27:00 : La Live Démo (Le Cœur du sujet)

_Configuration : VS Code ouvert en zoom 150%, projet vide cloné, panneau de prévisualisation LikeC4 ouvert à droite._

**Scène 1 : La Page Blanche & L'IA (5 min)**

- **Action :** Tu ouvres un fichier `main.c4`. C'est vide.
	
- **Discours :** "On ne va pas taper tout le boilerplate à la main."
	
- **Interaction IA :** Tu ouvres Copilot (ou ton fichier de snippets de secours).
	
	- _Prompt verbal :_ "Génère-moi une architecture bancaire simple : Un client, une App Mobile, une API Backend et une Base de données."
		
- **Action :** Le code apparaît. Tu sauvegardes.
	
- **Effet Waouh :** Le diagramme apparaît instantanément à droite.
	
- **Point clé :** "Regardez la syntaxe. `customer -> mobile -> api`. C'est lisible, même pour un non-dev."
	

**Scène 2 : La "Diffability" & Collaboration (5 min)**

- **Action :** Tu ajoutes une relation. Par exemple, l'API envoie des mails via un service tiers (SendGrid).
	
- **Discours :** "Si je modifie un fichier `.drawio`, le diff Git est illisible (des milliers de lignes XML). Ici…"
	
- **Action :** Tu montres le diff (imaginaire ou via git lens).
	
	- `+ api -> sendgrid "Envoie email confirmation"`
		
- **Point clé :** "En Pull Request, je peux _lire_ l'intention de l'architecte. On peut faire une revue d'architecture comme on fait une revue de code."
	

**Scène 3 : La Puissance des Prédicats (5 min)**

- **Concept :** "C'est ici que LikeC4 écrase les outils de dessin."
	
- **Action :** Tu ne dessines pas une nouvelle vue. Tu codes une _règle_.
	
	- Tu tapes : `view payment_context { include * -> api_payment }` (ou snippet équivalent).
		
- **Résultat :** L'outil génère automatiquement un diagramme centré uniquement sur le paiement, en filtrant le bruit.
	
- **Discours :** "Je ne dessine pas les boîtes. Je demande à l'outil : _Montre-moi tout ce qui impacte le paiement_. Si l'architecture change, cette vue se mettra à jour seule."
	

**Scène 4 : Le Rendu Interactif (3 min)**

- **Action :** Tu lances le serveur de dev (`npm run dev`) et ouvres le navigateur en plein écran.
	
- **Démonstration :** Tu cliques sur le système global -> Tu entres dans le conteneur -> Tu cliques sur la DB.
	
- **Discours :** "Ce n'est pas une image. C'est du React. C'est navigable. C'est la Google Map de votre SI."
	

#### 27:00 - 30:00 : Conclusion & L'Industrialisation

- **Visuel :** Slide de fin. Un screenshot d'un pipeline GitHub Actions.
	
- **Discours :**
	
	- "Je ne l'ai pas montré en live, mais ce site statique se génère à chaque `git push` via une CI/CD."
		
	- "Résultat : Votre documentation est **synchronisée** avec vos commits. Si le code part en prod, la carte à jour part avec lui."
		
- **Call to Action :**
	
	- "Ce soir, ne dessinez pas. Clonez le repo 'hands-on-demo' (QR Code sur la slide), et laissez Copilot modéliser votre système actuel. Merci à tous."
		

#### 30:00 - 45:00 : Questions / Réponses (Buffer de sécurité)

- _Prépare-toi aux questions classiques :_
	
	- "Est-ce qu'on peut faire du Reverse Engineering depuis le code Java ?" (Rép : Oui c'est possible mais souvent trop bruyant, mieux vaut modéliser l'intention).
		
	- "C'est quoi la différence avec Structurizr ?" (Rép : Plus flexible, rendu plus moderne, moins strict sur le C4 pur).
		

---

### 🛠 Checklist de survie pour le Jour J

1. **Snippets prêts :** Prépare un fichier `demo-script.txt` ouvert sur un autre bureau. Si Copilot bug ou que tu perds le fil, tu copies-colles le bloc de code LikeC4 sans honte.
	
2. **Git Tags :** Idéalement, aie des tags git (`git checkout step1-init`, `git checkout step2-views`) si tu te retrouves coincé dans une erreur de syntaxe.
	
3. **Le Plan B (Panne totale) :** Aie les screenshots de chaque étape de la démo dans tes slides de secours (masquées). Si ton laptop ne se connecte pas à l'écran, tu peux faire le talk juste avec les slides.

4. **Le filet de sécurité ("Cheat Sheet") :** Aie un fichier texte ouvert sur un autre écran (ou imprimé) avec exactement les blocs de code que tu dois copier-coller si Copilot hallucine ou si tu as un trou de mémoire.
	
5. **Zoom VS Code :** Mets ton VS Code en Zoom assez gros (Command +) _avant_ de monter sur scène. On ne voit rien au fond de la salle sinon.
	
6. **Pas de Wifi ? Pas de problème :** Assure-toi que LikeC4 et tes extensions tournent en local sans internet si possible (ou partage de co téléphone prêt). Si tu dépends de l'API OpenAI pour Copilot, vérifie ta connexion avant.
	
7. **Si ça plante :** Aie les screenshots "Avant/Après" dans tes slides de secours cachées à la fin de ton deck PowerPoint. Si la démo casse, tu passes aux slides en disant "Bon, l'effet démo… voici ce qui aurait dû se passer, c'est magique, croyez-moi !" avec le sourire.
	

**Est-ce que tu veux que je te prépare les 3 ou 4 blocs de code "Snippets" exacts pour la démo LikeC4 (E-commerce example) ?**