/**
 * EXPORTADOR DE FOTOS DO GOOGLE DRIVE
 * ====================================
 *
 * Este script gera automaticamente a lista DRIVE_PHOTO_IDS com as
 * 900+ fotos para o site, a partir de uma pasta do seu Google Drive.
 *
 * COMO USAR (5 minutos):
 *
 * 1. Coloque todas as fotos em UMA pasta no seu Google Drive
 *    (pode ter subpastas, o script entra nelas também).
 *
 * 2. Abra a pasta no navegador e copie o ID dela na URL:
 *    https://drive.google.com/drive/folders/AQUI_FICA_O_ID
 *
 * 3. Acesse https://script.google.com → "Novo projeto".
 *
 * 4. Apague o conteúdo do editor, cole este arquivo inteiro e
 *    substitua COLE_O_ID_DA_PASTA_AQUI abaixo pelo ID copiado.
 *
 * 5. Clique em "Executar" (função exportarFotos) e autorize o
 *    acesso quando o Google pedir. Com 900 fotos pode demorar
 *    alguns minutos. Se passar de 6 minutos e parar, é só
 *    executar de novo: ele continua de onde parou.
 *
 * 6. Ao terminar, ele cria um arquivo chamado "photos.js" na
 *    raiz do seu Drive. Baixe esse arquivo e SUBSTITUA o conteúdo
 *    de docs/js/photos.js do site pelo conteúdo dele (mantendo as
 *    funções drivePhotoUrl/drivePhotoFallbackUrl/makePlaceholderPhotos —
 *    ou simplesmente substitua só a constante DRIVE_PHOTO_IDS).
 *
 * O script também marca cada foto como "qualquer pessoa com o
 * link pode ver" — isso é necessário para o site conseguir exibir
 * as imagens. Ninguém encontra as fotos sem ter o link/ID.
 */

var PASTA_ID = 'COLE_O_ID_DA_PASTA_AQUI';

function exportarFotos() {
  var props = PropertiesService.getScriptProperties();
  var ids = JSON.parse(props.getProperty('ids') || '[]');
  var feitas = JSON.parse(props.getProperty('feitas') || '{}');
  var inicio = Date.now();

  processarPasta(DriveApp.getFolderById(PASTA_ID), ids, feitas, inicio);

  props.setProperty('ids', JSON.stringify(ids));
  props.setProperty('feitas', JSON.stringify(feitas));

  var conteudo = 'const DRIVE_PHOTO_IDS = [\n' +
    ids.map(function (id) { return '  "' + id + '",'; }).join('\n') +
    '\n];\n';
  DriveApp.createFile('photos.js', conteudo, 'text/plain');
  Logger.log('Pronto! ' + ids.length + ' fotos exportadas no arquivo photos.js (raiz do Drive).');
}

function processarPasta(pasta, ids, feitas, inicio) {
  var arquivos = pasta.getFiles();
  while (arquivos.hasNext()) {
    // para antes do limite de 6 min do Apps Script; rode de novo para continuar
    if (Date.now() - inicio > 5 * 60 * 1000) {
      Logger.log('Tempo quase no limite — execute novamente para continuar de onde parou.');
      return;
    }
    var f = arquivos.next();
    var id = f.getId();
    if (feitas[id]) continue;
    if (f.getMimeType().indexOf('image/') === 0) {
      try {
        f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      } catch (e) {
        Logger.log('Não consegui liberar o link de: ' + f.getName());
      }
      ids.push(id);
    }
    feitas[id] = true;
  }
  var subpastas = pasta.getFolders();
  while (subpastas.hasNext()) {
    processarPasta(subpastas.next(), ids, feitas, inicio);
  }
}

/** Use se quiser recomeçar a exportação do zero. */
function limparProgresso() {
  PropertiesService.getScriptProperties().deleteAllProperties();
  Logger.log('Progresso limpo.');
}
