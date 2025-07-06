# 🌍 Tradução Contínua

> Traduza automaticamente sua documentação markdown usando IA - alimentado por [GitHub Actions](https://github.com/actions) e [GitHub Models](https://github.com/models) com suporte integrado para [Astro Starlight](https://starlight.astro.build/)!

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/continuous-translation)
[![Documentação](https://img.shields.io/badge/📖-Documentação-green)](https://pelikhan.github.io/action-continuous-translation/)

## ✨ Funcionalidades

* 🚀 **Tradução Incremental** - Traduz apenas o conteúdo alterado, economizando tempo e custos de API
* 🎯 **Análise AST Inteligente** - Preserva a estrutura e formatação do markdown
* 🔄 **Gerenciamento de Cache** - Cache inteligente para evitar traduções redundantes
* 📚 **Pronto para Astro Starlight** - Suporte integrado para sites de documentação
* 🌐 **Suporte a Múltiplos Idiomas** - Traduza para vários idiomas simultaneamente
* 🔍 **Validação de Qualidade** - Validação automática da qualidade da tradução
* ⚡ **Nativo do GitHub Actions** - Integração perfeita com seu pipeline CI/CD

## 📚 Recursos

* 📖 [**Documentação**](https://pelikhan.github.io/action-continuous-translation/) - Guia completo de configuração e referência da API
* ✍️ [**Post no Blog**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - Análise detalhada da tecnologia
* 🌐 **Traduções**: [Français](./README.fr.md) | [Español](./README.es.md) | [العربية](./README.ar.md)

## 🔧 Como Funciona

Esta ação utiliza [GenAIScript](https://microsoft.github.io/genaiscript/) para analisar e traduzir de forma inteligente seus documentos markdown. Aqui está a mágica por trás dos bastidores:

1. **📄 Analisar** - Converter markdown para AST (Árvore de Sintaxe Abstrata)
2. **🔍 Examinar** - Identificar conteúdo que precisa de tradução vs. traduções existentes
3. **🤖 Traduzir** - Usar IA para gerar traduções de alta qualidade
4. **✅ Validar** - Garantir a qualidade da tradução e injetá-la no documento
5. **💾 Cache** - Salvar traduções para futuras atualizações incrementais
6. **📝 Commit** - Realizar commits automáticos das alterações no seu repositório

## ⚙️ Configuração

### 📝 Configurações Básicas

| Parâmetro           | Descrição                                                               | Padrão      |
| ------------------- | ----------------------------------------------------------------------- | ----------- |
| `lang`              | Idioma(s) de destino para tradução (códigos ISO, separados por vírgula) | `fr`        |
| `source`            | Idioma de origem (código ISO)                                           | `en`        |
| `files`             | Arquivos para traduzir (separados por ponto e vírgula)                  | `README.md` |
| `instructions`      | Instruções personalizadas de tradução                                   | -           |
| `instructions_file` | Caminho para o arquivo com instruções de tradução                       | -           |

### 🌟 Integração com Astro Starlight

| Parâmetro        | Descrição                                     | Obrigatório            |
| ---------------- | --------------------------------------------- | ---------------------- |
| `starlight_dir`  | Pasta raiz da documentação do Astro Starlight | Somente para Starlight |
| `starlight_base` | Alias base para a documentação do Starlight   | Opcional               |

### 🔧 Diagnóstico e Depuração

| Parâmetro | Descrição                                                                                                        | Padrão  |
| --------- | ---------------------------------------------------------------------------------------------------------------- | ------- |
| `force`   | Forçar tradução mesmo que já esteja traduzido                                                                    | `false` |
| `debug`   | Habilitar registro de depuração[saiba mais](https://microsoft.github.io/genaiscript/reference/scripts/logging/)) | `false` |

### 🤖 Configuração do Provedor de IA

#### Modelos do GitHub (Recomendado)

| Parâmetro      | Descrição                                                                                                                                                       | Padrão                        |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `github_token` | Token do GitHub com `models: read`permissão[guia de configuração](https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) | `${{ secrets.GITHUB_TOKEN }}` |

#### OpenAI

| Parâmetro         | Descrição                 | Padrão                          |
| ----------------- | ------------------------- | ------------------------------- |
| `openai_api_key`  | Chave de API do OpenAI    | `${{ secrets.OPENAI_API_KEY }}` |
| `openai_api_base` | URL base de API do OpenAI | `${{ env.OPENAI_API_BASE }}`    |

#### Azure OpenAI

| Parâmetro                      | Descrição                                                             | Padrão                                    |
| ------------------------------ | --------------------------------------------------------------------- | ----------------------------------------- |
| `azure_openai_api_endpoint`    | Endpoint do Azure OpenAI                                              | `${{ env.AZURE_OPENAI_API_ENDPOINT }}`    |
| `azure_openai_api_key`         | Chave da API do Azure OpenAI (não necessária para Microsoft Entra ID) | `${{ secrets.AZURE_OPENAI_API_KEY }}`     |
| `azure_openai_subscription_id` | ID de assinatura para listagem de implantação (somente Entra ID)      | `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}` |
| `azure_openai_api_version`     | Versão da API do Azure OpenAI                                         | `${{ env.AZURE_OPENAI_API_VERSION }}`     |
| `azure_openai_api_credentials` | Tipo de credenciais da API                                            | `${{ env.AZURE_OPENAI_API_CREDENTIALS }}` |

## 📤 Saídas

| Saída  | Descrição                           |
| ------ | ----------------------------------- |
| `text` | O texto de saída da tradução gerada |

## 🚀 Início Rápido

### Configuração Simples

Adicione esta etapa ao seu fluxo de trabalho do GitHub Actions para traduzir seu README para Francês e Espanhol:

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

### Exemplo Completo de Fluxo de Trabalho

Salve este arquivo no diretório `.github/workflows/` como `continuous-translation.yml`:

```yaml
name: Continuous Translation
on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - "README.md"
      - "docs/src/content/docs/**"
permissions:
  contents: write
  models: read
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
jobs:
  continuous_translation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/cache@v4
        with:
          path: .genaiscript/cache/**
          key: continuous-translation-${{ github.run_id }}
          restore-keys: |
            continuous-translation-
      - uses: pelikhan/action-continuous-translation@v0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          lang: fr,es
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          file_pattern: "translations/*.json **.md* translations/*.json"
          commit_message: "[cai] translated docs"
          commit_user_name: "genaiscript"
```

## 🛠️ Desenvolvimento e Contribuição

### Arquitetura do Projeto

Esta ação é gerada automaticamente pelo GenAIScript a partir de metadados do script, garantindo consistência e confiabilidade. Recomendamos atualizar os metadados do script em vez de editar diretamente os arquivos da ação.

**Componentes gerados automaticamente:**

* ⚙️ Entradas da ação → inferidas dos parâmetros do script
* 📤 Saídas da ação → inferidas do esquema de saída do script
* 📝 Descrição da ação → descrição do script
* 📖 Descrição do README → descrição do script
* 🎨 Identidade visual da ação → identidade visual do script

### 🧞 Comandos de Desenvolvimento

Todos os comandos devem ser executados a partir do diretório raiz do projeto:

| Comando              | Ação                                    | Caso de Uso                     |
| :------------------- | :-------------------------------------- | :------------------------------ |
| `npm install`        | Instalar dependências                   | Configuração inicial            |
| `npm run dev`        | Testar tradução de `README.md`→ Francês | Teste rápido                    |
| `npm run dev:astro`  | Traduzir toda a documentação do Astro   | Tradução completa de documentos |
| `npm run typecheck`  | Validar arquivos TypeScript             | Qualidade do código             |
| `npm run lint`       | Formatar código com Prettier            | Estilo de código                |
| `npm run configure`  | Regenerar `action.yml`                  | Após alterações de parâmetros   |
| `npm run upgrade`    | Atualizar dependências                  | Manutenção                      |
| `npm run test:genai` | Executar suíte de testes local          | Garantia de qualidade           |

***

<div align="center">

**Feito com ❤️ usando [GenAIScript](https://microsoft.github.io/genaiscript/)**

[📖 Documentação](https://pelikhan.github.io/action-continuous-translation/) • [🐛 Problemas](https://github.com/pelikhan/action-continuous-translation/issues) • [💡 Discussões](https://github.com/pelikhan/action-continuous-translation/discussions)

</div>
