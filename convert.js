const axios = require('axios');
const fs = require('fs');

function convertCode(code, fromLang, toLang) {
    const url = 'https://carbon.now.sh/api/convert';
    const data = {
        code: code,
        from: fromLang,
        to: toLang
    };

    axios.post(url, data)
        .then(response => {
            const convertedCode = response.data.code;
            fs.writeFile(`output.${toLang}`, convertedCode, err => {
                if (err) {
                    console.error('Erro ao escrever o arquivo de saída.', err);
                } else {
                    console.log(`Arquivo 'output.${toLang}' criado com sucesso.`);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao converter o código.', error);
        });
}

function getLanguages() {
    const url = 'https://carbon.now.sh/api/languages';

    axios.get(url)
        .then(response => {
            const languages = response.data.languages;
            console.log('Linguagens disponíveis:');
            languages.forEach((lang, index) => {
                console.log(`${index + 1}. ${lang}`);
            });
            console.log(`${languages.length + 1}. Todas as Linguagens`);
            promptConversion(languages);
        })
        .catch(error => {
            console.error('Erro ao obter a lista de linguagens.', error);
        });
}

function promptConversion(languages) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Digite o código ou o caminho do arquivo:\n1. Código\n2. Caminho do arquivo\nOpção: ', inputType => {
        if (inputType === '1') {
            readline.question('Digite o código: ', code => {
                selectLanguages(code, languages);
                readline.close();
            });
        } else if (inputType === '2') {
            readline.question('Digite o caminho do arquivo: ', filePath => {
                fs.readFile(filePath, 'utf8', (err, code) => {
                    if (err) {
                        console.error('Erro ao ler o arquivo.', err);
                        readline.close();
                    } else {
                        selectLanguages(code, languages);
                        readline.close();
                    }
                });
            });
        } else {
            console.log('Opção inválida.');
            readline.close();
        }
    });
}

function selectLanguages(code, languages) {
    console.log('Linguagens disponíveis:');
    languages.forEach((lang, index) => {
        console.log(`${index + 1}. ${lang}`);
    });
    console.log(`${languages.length + 1}. Todas as Linguagens`);

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Digite o número da linguagem de origem: ', fromLangIndex => {
        if (fromLangIndex < 1 || fromLangIndex > languages.length + 1) {
            console.log('Opção inválida.');
            readline.close();
        } else {
            const fromLang = (fromLangIndex === languages.length + 1) ? 'auto' : languages[fromLangIndex - 1];
            readline.question('Digite o número da linguagem de destino: ', toLangIndex => {
                if (toLangIndex < 1 || toLangIndex > languages.length + 1) {
                    console.log('Opção inválida.');
                    readline.close();
                } else {
                    const toLang = (toLangIndex === languages.length + 1) ? languages : [languages[toLangIndex - 1]];
                    convertCode(code, fromLang, toLang);
                    readline.close();
                }
            });
        }
    });
}

getLanguages();
