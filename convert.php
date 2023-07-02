<?php

function convertCode($code, $fromLang, $toLang) {
    $url = 'https://carbon.now.sh/api/convert';
    $data = [
        'code' => $code,
        'from' => $fromLang,
        'to' => $toLang
    ];

    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/json',
            'content' => json_encode($data)
        ]
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);

    if ($response !== false) {
        $result = json_decode($response, true);
        $convertedCode = $result['code'];
        file_put_contents("output.$toLang", $convertedCode);
        echo "Arquivo 'output.$toLang' criado com sucesso.\n";
    } else {
        echo "Erro ao converter o código.\n";
    }
}

function getLanguages() {
    $url = 'https://carbon.now.sh/api/languages';
    $response = file_get_contents($url);

    if ($response !== false) {
        $result = json_decode($response, true);
        $languages = $result['languages'];
        echo "Linguagens disponíveis:\n";
        foreach ($languages as $index => $lang) {
            echo ($index + 1) . ". $lang\n";
        }
        echo count($languages) + 1 . ". Todas as Linguagens\n";
        promptConversion($languages);
    } else {
        echo "Erro ao obter a lista de linguagens.\n";
    }
}

function promptConversion($languages) {
    $inputType = readline("Digite o código ou o caminho do arquivo:\n1. Código\n2. Caminho do arquivo\nOpção: ");

    if ($inputType === '1') {
        $code = readline("Digite o código: ");
        selectLanguages($code, $languages);
    } elseif ($inputType === '2') {
        $filePath = readline("Digite o caminho do arquivo: ");
        $code = file_get_contents($filePath);
        if ($code !== false) {
            selectLanguages($code, $languages);
        } else {
            echo "Erro ao ler o arquivo.\n";
        }
    } else {
        echo "Opção inválida.\n";
    }
}

function selectLanguages($code, $languages) {
    echo "Linguagens disponíveis:\n";
    foreach ($languages as $index => $lang) {
        echo ($index + 1) . ". $lang\n";
    }
    echo count($languages) + 1 . ". Todas as Linguagens\n";

    $fromLangIndex = readline("Digite o número da linguagem de origem: ");
    if ($fromLangIndex < 1 || $fromLangIndex > count($languages) + 1) {
        echo "Opção inválida.\n";
        return;
    }

    $fromLang = ($fromLangIndex === count($languages) + 1) ? 'auto' : $languages[$fromLangIndex - 1];

    $toLangIndex = readline("Digite o número da linguagem de destino: ");
    if ($toLangIndex < 1 || $toLangIndex > count($languages) + 1) {
        echo "Opção inválida.\n";
        return;
    }

    $toLang = ($toLangIndex === count($languages) + 1) ? $languages : [$languages[$toLangIndex - 1]];

    convertCode($code, $fromLang, $toLang);
}

getLanguages();
