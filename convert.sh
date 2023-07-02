#!/bin/bash

function convertCode() {
    local code="$1"
    local fromLang="$2"
    local toLang="$3"
    local url="https://carbon.now.sh/api/convert"

    local response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"code":"'"$code"'","from":"'"$fromLang"'","to":"'"$toLang"'"}' "$url")

    if [[ "$response" != *"code"* ]]; then
        echo "Erro ao converter o código."
        return
    fi

    local convertedCode=$(echo "$response" | jq -r '.code')
    echo "$convertedCode" > "output.$toLang"
    echo "Arquivo 'output.$toLang' criado com sucesso."
}

function getLanguages() {
    local url="https://carbon.now.sh/api/languages"

    local response=$(curl -s "$url")

    if [[ "$response" != *"languages"* ]]; then
        echo "Erro ao obter a lista de linguagens."
        return
    fi

    local languages=$(echo "$response" | jq -r '.languages')
    echo "Linguagens disponíveis:"
    for index in "${!languages[@]}"; do
        echo "$((index + 1)). ${languages[index]}"
    done
    echo "$((index + 2)). Todas as Linguagens"
    promptConversion "$languages"
}

function promptConversion() {
    local -a languages=("$@")
    read -p "Digite o código ou o caminho do arquivo:
1. Código
2. Caminho do arquivo
Opção: " inputType

    if [[ $inputType == "1" ]]; then
        read -p "Digite o código: " code
        selectLanguages "$code" "${languages[@]}"
    elif [[ $inputType == "2" ]]; then
        read -p "Digite o caminho do arquivo: " filePath
        if [[ -f "$filePath" ]]; then
            code=$(cat "$filePath")
            selectLanguages "$code" "${languages[@]}"
        else
            echo "Erro ao ler o arquivo."
        fi
    else
        echo "Opção inválida."
    fi
}

function selectLanguages() {
    local code="$1"
    local -a languages=("${@:2}")

    echo "Linguagens disponíveis:"
    for index in "${!languages[@]}"; do
        echo "$((index + 1)). ${languages[index]}"
    done
    echo "$((index + 2)). Todas as Linguagens"

    read -p "Digite o número da linguagem de origem: " fromLangIndex

    if [[ $fromLangIndex -lt 1 || $fromLangIndex -gt $((index + 2)) ]]; then
        echo "Opção inválida."
        return
    fi

    local fromLang
    if [[ $fromLangIndex -eq $((index + 2)) ]]; then
        fromLang="auto"
    else
        fromLang="${languages[fromLangIndex - 1]}"
    fi

    read -p "Digite o número da linguagem de destino: " toLangIndex

    if [[ $toLangIndex -lt 1 || $toLangIndex -gt $((index + 2)) ]]; then
        echo "Opção inválida."
        return
    fi

    local toLang
    if [[ $toLangIndex -eq $((index + 2)) ]]; then
        toLang="${languages[@]}"
    else
        toLang="${languages[toLangIndex - 1]}"
    fi

    convertCode "$code" "$fromLang" "$toLang"
}

getLanguages
