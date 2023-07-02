import requests

def convert_code(code, from_lang, to_lang):
    url = "https://carbon.now.sh/api/convert"
    data = {
        "code": code,
        "from": from_lang,
        "to": to_lang
    }
    response = requests.post(url, json=data)
    if response.ok:
        result = response.json()
        converted_code = result['code']
        return converted_code
    else:
        print("Erro ao converter o código.")
        return None

def get_languages():
    url = "https://carbon.now.sh/api/languages"
    response = requests.get(url)
    if response.ok:
        result = response.json()
        languages = result['languages']
        return languages
    else:
        print("Erro ao obter a lista de linguagens.")
        return None

def main():
    print("Digite o código ou o caminho do arquivo:")
    input_type = input("1. Código\n2. Caminho do arquivo\nOpção: ")

    if input_type == '1':
        code = input("Digite o código: ")
    elif input_type == '2':
        file_path = input("Digite o caminho do arquivo: ")
        with open(file_path, 'r') as file:
            code = file.read()
    else:
        print("Opção inválida.")
        return

    languages = get_languages()
    if not languages:
        return

    print("Linguagens disponíveis:")
    for index, lang in enumerate(languages, start=1):
        print(f"{index}. {lang}")
    print(f"{len(languages)+1}. Todas as Linguagens")

    from_lang_index = int(input("Digite o número da linguagem de origem: "))
    if from_lang_index < 1 or from_lang_index > len(languages) + 1:
        print("Opção inválida.")
        return
    elif from_lang_index == len(languages) + 1:
        from_lang = "auto"
    else:
        from_lang = languages[from_lang_index - 1]

    to_lang_index = int(input("Digite o número da linguagem de destino: "))
    if to_lang_index < 1 or to_lang_index > len(languages) + 1:
        print("Opção inválida.")
        return
    elif to_lang_index == len(languages) + 1:
        to_lang = languages
    else:
        to_lang = [languages[to_lang_index - 1]]

    for lang in to_lang:
        converted_code = convert_code(code, from_lang, lang)
        if converted_code:
            with open(f'output.{lang}', 'w') as file:
                file.write(converted_code)
            print(f"Arquivo 'output.{lang}' criado com sucesso.")

if __name__ == '__main__':
    main()
