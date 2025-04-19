# MétéoCréative

![image](https://github.com/user-attachments/assets/4e9604d4-8501-462d-a126-f187a8d2b83f)

## 📱 Une application météo élégante et intuitive

MétéoCréative est une application météo moderne qui offre une expérience utilisateur exceptionnelle grâce à son interface réactive et esthétique. L'application adapte dynamiquement son apparence en fonction des conditions météorologiques actuelles, créant une expérience immersive et informative.

## ✨ Caractéristiques

- **Interface adaptative** - Le design et les couleurs s'adaptent automatiquement aux conditions météorologiques
- **Animations dynamiques** - Effets visuels pour la pluie, la neige et les nuages
- **Vue météo actuelle** - Informations détaillées sur les conditions actuelles
- **Prévisions** - Prévisions sur 5 jours et prévisions horaires
- **Statistiques météo** - Visualisation des données et tendances
- **Recherche de villes** - Recherchez facilement la météo de n'importe quelle ville
- **Design responsive** - S'adapte parfaitement aux appareils mobiles et de bureau
- **Changement d'unités** - Basculez facilement entre Celsius et Fahrenheit

## 🛠️ Technologies utilisées

- **React** - Bibliothèque frontend JavaScript
- **Tailwind CSS** - Framework CSS utilitaire
- **OpenWeatherMap API** - Source des données météorologiques
- **Lucide React** - Icônes modernes et élégantes
- **React Hooks** - Pour la gestion de l'état et des effets

## 📋 Prérequis

- Node.js (v14.0.0 ou supérieur)
- NPM (v6.0.0 ou supérieur)
- Clé API OpenWeatherMap

## 🚀 Installation

1. Clonez ce dépôt
   ```bash
   git clone https://github.com/votre-nom/meteo-creative.git
   cd meteo-creative
   ```

2. Installez les dépendances
   ```bash
   npm install
   ```

3. Créez un fichier `.env` à la racine du projet et ajoutez votre clé API OpenWeatherMap
   ```
   REACT_APP_OPENWEATHER_API_KEY=votre_clé_api
   ```

4. Démarrez l'application en mode développement
   ```bash
   npm start
   ```

5. L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## 🖥️ Utilisation

### Recherche d'une ville
Entrez le nom de la ville dans la barre de recherche en haut de l'application et appuyez sur Entrée ou cliquez sur l'icône de recherche.

### Navigation dans l'application
L'application est divisée en trois sections principales accessibles via le menu supérieur :
- **Aujourd'hui** - Affiche les conditions météorologiques actuelles
- **Prévisions** - Montre les prévisions pour les jours à venir
- **Statistiques** - Présente les données météorologiques sous forme de graphiques et de statistiques

### Changement d'unités
Cliquez sur le bouton °C/°F en haut à droite pour basculer entre les unités métriques et impériales.

## 📊 Structure du projet

```
meteo-creative/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── CreativeWeatherApp.jsx
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## 🔧 Personnalisation

### Changer la ville par défaut
Modifiez la ligne suivante dans `CreativeWeatherApp.jsx` :
```jsx
const [city, setCity] = useState('Safi');
```

### Ajouter de nouvelles recommandations
Personnalisez les recommandations météo en modifiant la section suivante :
```jsx
{weather.weather[0].main === 'Rain' ? 
  "N'oubliez pas votre parapluie ! Il pleut actuellement." :
  // Ajoutez vos conditions et recommandations ici
}
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request pour améliorer l'application.

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 👏 Remerciements

- [OpenWeatherMap](https://openweathermap.org/) pour l'API météo
- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS
- [Lucide React](https://lucide.dev/) pour les icônes
- Tous les contributeurs qui ont participé à ce projet

---

Développé avec ❤️ par [Votre Nom]
