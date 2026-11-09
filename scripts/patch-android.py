"""Ajustes no projeto Android gerado: ícone, tela de abertura preta e número da versão."""
import os, re, shutil, sys

res = 'android/app/src/main/res'
if not os.path.isdir(res):
    sys.exit('Pasta do projeto Android não encontrada: ' + res)

# ícones do aplicativo (só a logo, sem o nome)
shutil.copytree('android-res', res, dirs_exist_ok=True)
print('icones copiados')

# fundo preto na abertura nativa (substitui a imagem padrão do Capacitor)
n = 0
for dp, _, files in os.walk(res):
    for f in files:
        if f == 'splash.png':
            shutil.copy('assets/black.png', os.path.join(dp, f)); n += 1
print('splash.png substituidos:', n)

# abertura nativa do Android 12 ou mais novo: fundo preto, sem imagem
p = os.path.join(res, 'values', 'styles.xml')
if os.path.exists(p):
    s = open(p, encoding='utf-8').read()
    m = re.search(r'(<style name="AppTheme\.NoActionBarLaunch"[^>]*>)(.*?)(</style>)', s, re.S)
    if m and 'Theme.SplashScreen' in m.group(1):
        add = ('\n        <item name="windowSplashScreenBackground">#000000</item>'
               '\n        <item name="windowSplashScreenAnimatedIcon">@android:color/transparent</item>\n    ')
        s = s[:m.end(2)] + add + s[m.end(2):]
        open(p, 'w', encoding='utf-8').write(s)
        print('splash do Android 12 ajustada')
    else:
        print('estilo de abertura nao encontrado; pulando')

# número da versão = número da execução (permite instalar por cima do app antigo)
run = os.environ.get('GITHUB_RUN_NUMBER')
g = 'android/app/build.gradle'
if run and os.path.exists(g):
    s = open(g, encoding='utf-8').read()
    s2 = re.sub(r'versionCode\s+\d+', 'versionCode ' + run, s, count=1)
    s2 = re.sub(r'versionName\s+"[^"]*"', 'versionName "1.' + run + '"', s2, count=1)
    open(g, 'w', encoding='utf-8').write(s2)
    print('versionCode =', run)
