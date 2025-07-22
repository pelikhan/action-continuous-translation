---
title: Exemplo de Markdown
sidebar:
  order: 100

---

# Guia Completo de Sintaxe Markdown

Este documento demonstra todas as principais construções sintáticas disponíveis no Markdown.

## Cabeçalhos

# Cabeçalho H1

## Cabeçalho H2

### Cabeçalho H3

#### Cabeçalho H4

##### Cabeçalho H5

###### Cabeçalho H6

# Alternativa H1

## Alternativa H2

## Formatação de Texto

**Texto em negrito usando asteriscos**\
**Texto em negrito usando sublinhados**

*Texto em itálico usando asteriscos*\
*Texto em itálico usando sublinhados*

***Texto em negrito e itálico usando asteriscos***\
***Texto em negrito e itálico usando sublinhados***

~~Texto com tachado~~

`Inline code`

Texto normal com **negrito**, *itálico* e `código` misturados.

## Listas

### Listas não ordenadas

* Item 1
* Item 2
  * Subitem 2.1
  * Subitem 2.2
    * Subitem profundamente aninhado 2.2.1
* Item 3

Sintaxe alternativa:

* Item A
* Item B
  * Subitem B.1
  * Subitem B.2

Outra alternativa:

* Item X
* Item Y
  * Subitem Y.1

### Listas ordenadas

1. Primeiro item
2. Segundo item
   1. Item numerado aninhado
   2. Outro item aninhado
      1. Item profundamente aninhado
3. Terceiro item

Numeração alternativa:

1. Item um
2. Item dois (numeração automática)
3. Item três (numeração automática)

### Listas mistas

1. Item ordenado
   * Item não ordenado aninhado
   * Outro item não ordenado aninhado
2. Outro item ordenado
   1. Item ordenado aninhado
   2. Outro item ordenado aninhado

### Listas de tarefas

* [x] Tarefa concluída
* [ ] Tarefa incompleta
* [x] Outra tarefa concluída
  * [x] Tarefa concluída aninhada
  * [ ] Tarefa incompleta aninhada

## Links e Imagens

### Links

[Link simples](https://www.example.com)

[Link com título](https://www.example.com "Example Website")

// TODO desativar MDX\
< [https://www.autolink.com>](https://www.autolink.com>)

[Link de referência][ref1]

[Outro link de referência][ref2]

[Link de referência insensível a maiúsculas e minúsculas][REF1]

Você também pode criar links para [arquivos locais](./README.md).

### Imagens

![Texto alternativo](https://via.placeholder.com/150x100 "Image title")

![Reference image][img1]

### Definições de referência

[ref1]: https://www.reference1.com "Reference 1 Title"

[ref2]: https://www.reference2.com

[img1]: https://via.placeholder.com/200x150 "Reference Image"

## Código

### Código inline

Use `console.log()` para imprimir no console.

### Blocos de código

```
Simple code block without syntax highlighting
```

```javascript
// JavaScript code block
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

```python
# Python code block
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

```bash
# Bash script
#!/bin/bash
echo "Hello, World!"
for i in {1..5}; do
    echo "Number: $i"
done
```

```json
{
  "name": "Sample JSON",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

Bloco de código indentado (4 espaços): &#x20;
TODO: corrigir esse problema de análise

## Tabelas

| Coluna 1 | Coluna 2   | Coluna 3   |
| -------- | ---------- | ---------- |
| Linha 1  | Dados      | Mais dados |
| Linha 2  | Informação | Detalhes   |

### Tabela com Alinhamento

| Alinhado à Esquerda | Alinhado ao Centro | Alinhado à Direita |
| :------------------ | :----------------: | -----------------: |
| Esquerda            |       Centro       |            Direita |
| Texto               |        Texto       |              Texto |
| Mais                |        Dados       |               Aqui |

### Tabela Simples

| Primeiro Cabeçalho   | Segundo Cabeçalho    |
| -------------------- | -------------------- |
| Celula de Conteúdo 1 | Celula de Conteúdo 2 |
| Celula de Conteúdo 3 | Celula de Conteúdo 4 |

## Citações

> Esta é uma citação simples.

> Esta é uma citação que se estende por várias linhas.

> Citações aninhadas:
>
> > Esta é uma citação aninhada.
> >
> > > E esta é profundamente aninhada.

> ### Citação com outros elementos
>
> * Item de lista em citação
> * Outro item
>
> **Texto em negrito** em uma citação com `código inline`.

## Linhas Horizontais

***

***

***

***

***

***

## Quebras de Linha

Esta é a primeira linha.\\\
Esta é a segunda linha (dois espaços no final da linha anterior).

Esta é a terceira linha.

Esta é a quarta linha (linha em branco cria a quebra de parágrafo).

Esta é uma linha com uma\\\
quebra de linha com barra invertida.

## Elementos HTML

Você pode usar <em>tags HTML</em> no Markdown.

<strong>Negrito usando HTML</strong>

<code>Código inline usando HTML</code>

<kbd>Ctrl</kbd> + <kbd>C</kbd>

<mark>Texto destacado</mark>

<small>Texto pequeno</small>

<sub>Subscrito</sub> e <sup>Sobrescrito</sup>

<details>
<summary>Expandable section</summary>

Este conteúdo está oculto por padrão e pode ser expandido.

* Item da lista
* Outro item

```javascript
console.log("Code in details");
```

</details>

## Recursos Avançados

### Notas de Rodapé

Aqui está uma frase com uma nota de rodapé\[^1].

Outra frase com uma nota de rodapé\[^note].

[^1]: Esta é a primeira nota de rodapé.

[^note]: Esta é uma nota de rodapé nomeada com mais detalhes.

### Listas de Definições

Termo 1 &#x20;
: Definição para o termo 1

Termo 2 &#x20;
: Definição para o termo 2 &#x20;
: Outra definição para o termo 2

### Abreviações

\\\_\\\[HTML]: Linguagem de Marcação de Hipertexto &#x20;
\\\_\\\[CSS]: Folhas de Estilo em Cascata

HTML e CSS são tecnologias importantes da web.

### Matemática (se suportada)

Matemática inline: $E = mc^2$

Matemática em bloco:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### Caracteres de Escape

Use barras invertidas para escapar caracteres especiais:

\\\*Não itálico\\\* &#x20;
\\#Não é um cabeçalho &#x20;
\\\[Não é um link] &#x20;
\\\`Não é código\\\`

### Comentários

### Emojis

\\\:sorriso: \\\:coração: \\\:legal: \\\:foguete: \\\:computador:

😀 😍 👍 🚀 💻

***

## Alertas do GitHub no Markdown

O GitHub suporta alertas personalizados em arquivos Markdown, que podem ser usados para destacar informações ou avisos importantes. Aqui estão alguns exemplos de como usá-los:

> [!NOTE]
> Informação útil que os usuários devem saber, mesmo ao passar rapidamente pelo conteúdo.

> [!TIP]
> Conselho útil para fazer as coisas de forma melhor ou mais fácil.

> [!IMPORTANT]
> Informação chave que os usuários precisam saber para alcançar seu objetivo.

> [!WARNING]
> Informação urgente que requer atenção imediata do usuário para evitar problemas.

> [!CAUTION]
> Aviso sobre riscos ou consequências negativas de certas ações.

## Conclusão

Este documento aborda a maior parte da sintaxe padrão do Markdown. Alguns recursos, como notas de rodapé, listas de definições, matemática e certos elementos HTML, podem não ser compatíveis com todos os processadores de Markdown, mas funcionam em muitas versões estendidas, como GitHub Flavored Markdown (GFM), CommonMark e outras.

**Nota**: A renderização exata desses elementos pode variar dependendo do processador de Markdown utilizado.
