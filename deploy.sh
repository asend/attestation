
PROJECT_NAME="attestation"
REMOTE_USER="root"
REMOTE_HOST="180.149.197.164"
REMOTE_DIR="/var/www/html/interco"
echo ":package: Build Angular project..."
npm run build:prod
echo ":rocket: Deploying to $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR ..."
rsync -avz dist/$PROJECT_NAME/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/
  echo ":white_check_mark: Deployment done!"


if [ $? -ne 0 ]; then
  echo "❌ Le build a échoué. Arrêt du script."
  exit 1
fi

if [ $? -eq 0 ]; then
  echo "✅ Déploiement terminé avec succès."
else
  echo "❌ Erreur lors du déploiement."
fi


