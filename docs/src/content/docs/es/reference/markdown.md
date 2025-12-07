---
title: Muestra de Markdown
sidebar:
  order: 100
---

# Guía Completa de la Sintaxis de Markdown

Este documento muestra todas las principales estructuras sintácticas disponibles en Markdown.

## Encabezados

# Encabezado H1

## Encabezado H2

### Encabezado H3

#### Encabezado H4

##### Encabezado H5

###### Encabezado H6

# H1 Alternativo

## H2 Alternativo

## Formato de texto

**Texto en negrita usando asteriscos**
**Texto en negrita usando guiones bajos**

_Texto en cursiva usando asteriscos_
_Texto en cursiva usando guiones bajos_

**_Texto en negrita y cursiva usando asteriscos_**
**_Texto en negrita y cursiva usando guiones bajos_**

~~Texto tachado~~

`Inline code`

Texto regular con **negrita**, _cursiva_ y `código` mezclados.

## Listas

### Listas Desordenadas

- Elemento 1
- Elemento 2
  - Elemento anidado 2.1
  - Elemento anidado 2.2
    - Elemento profundamente anidado 2.2.1
- Elemento 3

Sintaxis alternativa:

- Elemento A
- Elemento B
  - Elemento anidado B.1
  - Elemento anidado B.2

Otra alternativa:

- Elemento X
- Elemento Y
  - Elemento anidado Y.1

### Listas Ordenadas

1. Primer elemento
2. Segundo elemento
   1. Elemento numerado anidado
   2. Otro elemento anidado
      1. Elemento profundamente anidado
3. Tercer elemento

Numeración alternativa:

1. Elemento uno
2. Elemento dos (autonumerado)
3. Elemento tres (autonumerado)

### Listas Mixtas

1. Elemento ordenado
   - Elemento anidado desordenado
   - Otro elemento anidado desordenado
2. Otro elemento ordenado
   1. Elemento ordenado anidado
   2. Otro elemento ordenado anidado

### Listas de Tareas

- [x] Tarea completada
- [ ] Tarea incompleta
- [x] Otra tarea completada
  - [x] Tarea anidada completada
  - [ ] Tarea anidada incompleta

## Enlaces e Imágenes

### Enlaces

[Enlace simple](https://www.example.com)

[Enlace con título](https://www.example.com "Example Website")

// TODO desactivar MDX
< [https://www.autolink.com>](https://www.autolink.com>)

[Enlace de referencia][ref1]

[Otro enlace de referencia][ref2]

[Enlace de referencia insensible a mayúsculas][REF1]

También puedes enlazar a [archivos locales](./README.md).

### Imágenes

![Texto alternativo](https://via.placeholder.com/150x100 "Image title")

![Reference image][img1]

### Definiciones de Referencia

[ref1]: https://www.reference1.com "Reference 1 Title"
[ref2]: https://www.reference2.com
[img1]: https://via.placeholder.com/200x150 "Reference Image"

## Código

### Código Inline

Usa `console.log()` para imprimir en la consola.

### Bloques de Código

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

Bloque de código con sangría (4 espacios):
TODO: arreglar este problema de análisis

## Tablas

| Columna 1 | Columna 2   | Columna 3 |
| --------- | ----------- | --------- |
| Fila 1    | Datos       | Más datos |
| Fila 2    | Información | Detalles  |

### Tabla con Alineación

| Alineado a la Izquierda | Centrado | Alineado a la Derecha |
| :---------------------- | :------: | --------------------: |
| Izquierda               |  Centro  |               Derecha |
| Texto                   |  Texto   |                 Texto |
| Más                     |  Datos   |                  Aquí |

### Tabla Sencilla

| Primer Encabezado    | Segundo Encabezado   |
| -------------------- | -------------------- |
| Celda de contenido 1 | Celda de contenido 2 |
| Celda de contenido 3 | Celda de contenido 4 |

## Citas

> Esto es una cita simple.

> Esto es una cita que abarca múltiples líneas.

> Citas anidadas:
>
> > Esto es una cita anidada.
> >
> > > Y esto es una cita profundamente anidada.

> ### Cita con otros elementos
>
> - Elemento de lista en una cita
> - Otro elemento
>
> **Texto en negrita** en una cita con `código inline`.

## Líneas Horizontales

---

---

---

---

---

---

## Saltos de Línea

Esta es la primera línea.\
Esta es la segunda línea (dos espacios al final de la línea previa).

Esta es la tercera línea.

Esta es la cuarta línea (una línea vacía crea un salto de párrafo).

Esta es una línea con un\
salto de línea con barra invertida.

## Elementos HTML

Puedes usar <em>etiquetas HTML</em> en Markdown.

<strong>Negrita usando HTML</strong>

<code>Código inline usando HTML</code>

<kbd>Ctrl</kbd> + <kbd>C</kbd>

<mark>Texto resaltado</mark>

<small>Texto pequeño</small>

<sub>Subíndice</sub> y <sup>Superíndice</sup>

<details>
<summary>Expandable section</summary>

Este contenido está oculto por defecto y puede expandirse.

- Elemento de lista
- Otro elemento

```javascript
console.log("Code in details");
```

</details>

## Características Avanzadas

### Notas al pie

Aquí hay una oración con una nota al pie\[^1].

Otra oración con una nota al pie\[^nota].

[^1]: Esta es la primera nota al pie.
[^note]: Esta es una nota al pie con más detalles.

### Listas de Definiciones

Término 1
: Definición del término 1

Término 2
: Definición del término 2
: Otra definición del término 2

### Abreviaturas

\\\_\\\[HTML]: Lenguaje de marcado de hipertexto
\\\_\\\[CSS]: Hojas de estilo en cascada

HTML y CSS son tecnologías web importantes.

### Matemáticas (si se admite)

Matemática inline: $E = mc^2$

Matemáticas en bloque:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### Caracteres de escape

Usa barras invertidas para escapar caracteres especiales:

\\\*No en cursiva\\\*
\\#No un encabezado
\\\[No un enlace]
\\\`No código\\\`

### Comentarios

### Emojis

\\\:sonrisa: \\\:corazón: \\\:pulgar arriba: \\\:cohete: \\\:ordenador:

😀 😍 👍 🚀 💻

---

## Alertas de GitHub en Markdown

GitHub admite alertas personalizadas en archivos Markdown, que se pueden usar para resaltar información importante o advertencias. A continuación, se muestran algunos ejemplos de cómo utilizarlas:

> [!NOTE]
> Información útil que los usuarios deben conocer, incluso al hojear el contenido.

> [!TIP]
> Consejos útiles para hacer las cosas mejor o más fácilmente.

> [!IMPORTANT]
> Información clave que los usuarios necesitan saber para lograr su objetivo.

> [!WARNING]
> Información urgente que necesita atención inmediata del usuario para evitar problemas.

> [!CAUTION]
> Avisos sobre riesgos o resultados negativos de ciertas acciones.

## Conclusión

Este documento cubre la mayor parte de la sintaxis estándar de Markdown. Algunas características, como las notas al pie, las listas de definiciones, las matemáticas y ciertos elementos HTML, pueden no ser compatibles con todos los procesadores de Markdown, pero funcionan en muchas versiones extendidas como GitHub Flavored Markdown (GFM), CommonMark, y otras.

**Nota**: La representación exacta de estos elementos puede variar según el procesador de Markdown que se utilice.
