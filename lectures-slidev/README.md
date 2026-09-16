# DGM course in Slidev

Параллельная версия курса: Beamer-исходники и PDF остаются в `../lectures/`.
Весь Slidev использует один набор зависимостей и общую локальную тему.
Правила переноса: [MIGRATION.md](MIGRATION.md).

## Лекции

| Лекция | Исходник | PDF с раскрытиями | Раздатка | Перенос и проверки |
|---|---|---|---|---|
| 1 | [slides.md](lecture1/slides.md) | [Lecture1.pdf](lecture1/Lecture1.pdf) | [Lecture1-handout.pdf](lecture1/Lecture1-handout.pdf) | [migration.md](lecture1/migration.md) |
| 2 | [slides.md](lecture2/slides.md) | [Lecture2.pdf](lecture2/Lecture2.pdf) | [Lecture2-handout.pdf](lecture2/Lecture2-handout.pdf) | [migration.md](lecture2/migration.md) |
| 3 | [slides.md](lecture3/slides.md) | [Lecture3.pdf](lecture3/Lecture3.pdf) | [Lecture3-handout.pdf](lecture3/Lecture3-handout.pdf) | [migration.md](lecture3/migration.md) |
| 4 | [slides.md](lecture4/slides.md) | [Lecture4.pdf](lecture4/Lecture4.pdf) | [Lecture4-handout.pdf](lecture4/Lecture4-handout.pdf) | [migration.md](lecture4/migration.md) |
| 5 | [slides.md](lecture5/slides.md) | [Lecture5.pdf](lecture5/Lecture5.pdf) | [Lecture5-handout.pdf](lecture5/Lecture5-handout.pdf) | [migration.md](lecture5/migration.md) |
| 6 | [slides.md](lecture6/slides.md) | [Lecture6.pdf](lecture6/Lecture6.pdf) | [Lecture6-handout.pdf](lecture6/Lecture6-handout.pdf) | [migration.md](lecture6/migration.md) |
| 7 | [slides.md](lecture7/slides.md) | [Lecture7.pdf](lecture7/Lecture7.pdf) | [Lecture7-handout.pdf](lecture7/Lecture7-handout.pdf) | [migration.md](lecture7/migration.md) |
| 8 | [slides.md](lecture8/slides.md) | [Lecture8.pdf](lecture8/Lecture8.pdf) | [Lecture8-handout.pdf](lecture8/Lecture8-handout.pdf) | [migration.md](lecture8/migration.md) |

## Запуск

Требуется **Node 24.19.0** (см. `.nvmrc`). Из корня репозитория:

```sh
cd lectures-slidev
npm ci
npm run dev -- 1
```

Номер после `--` выбирает лекцию. По умолчанию — 1. Для лекции N используется
порт 3030 + N. В каждой папке лекции основной файл называется `slides.md`.

- Lecture 1: `http://localhost:3031/`.
- Lecture 2: `http://localhost:3032/` (`npm run dev -- 2`).
- Lecture 3: `http://localhost:3033/` (`npm run dev -- 3`).
- Lecture 4: `http://localhost:3034/` (`npm run dev -- 4`).
- Lecture 5: `http://localhost:3035/` (`npm run dev -- 5`).
- Lecture 6: `http://localhost:3036/` (`npm run dev -- 6`).
- Lecture 7: `http://localhost:3037/` (`npm run dev -- 7`).
- Lecture 8: `http://localhost:3038/` (`npm run dev -- 8`).
- Режим преподавателя: `http://localhost:3031/presenter/1`.
- Показ с закреплённой панелью пера: `http://localhost:3031/1?tools`.
- Arrow Right / Space — следующий шаг; Arrow Left — предыдущий.
- Кнопки переходов в панели работают и при включённом пере.
- Сервер по умолчанию доступен только с этого компьютера. Доступ отдельного
  планшета по сети требует отдельно настроенного и разрешённого сетевого режима.

## Завершение миграции и PDF

После переноса или изменения лекции остановить dev-сервер и выполнить:

```sh
npm run finalize -- 1
```

Команда проверяет соответствие Beamer, карту слайдов, ссылки, изображения и
макросы; выполняет численные тесты демо и проверки команд; собирает веб-версию
и **оба PDF**. Экспорт проверяет число страниц и обновляет файлы рядом с лекцией
только после успешной сборки обоих вариантов:

- `lecture1/Lecture1.pdf` — 91 страница со всеми раскрытиями.
- `lecture1/Lecture1-handout.pdf` — 46 страниц с финальными состояниями.

Эти два файла включаются в коммит завершённой миграции вместе с исходником.
Промежуточные PDF, веб-сборка, QA и зависимости исключены из Git.
Beamer PDF и `lectures/merged/` команда не меняет.

Отдельные этапы: `npm run check -- 1`, `npm run build -- 1`,
`npm run export -- 1`, `npm run test:demos`.

Для визуальной проверки всех страниц:

```sh
python tools/render-qa.py 1
```

Нужны Python-пакеты `pypdf`, `pypdfium2`, `Pillow`. Скрипт проверяет число страниц,
извлекает текст и создаёт контактные листы в `output/qa/lecture1/`.
Просмотр PDF обязателен: успешная сборка не проверяет вёрстку автоматически.

После экспорта снова запустить `npm run dev -- 1`. При работающем сервере:

```sh
node tools/inspect.mjs 1
node tools/inspect-demos.mjs 1
```

Общий инспектор проверяет карту и раскрытия; сценарии пера и демо сейчас
проверяются для Lecture 1. `SLIDEV_QA_URL` позволяет выбрать другой адрес.
Экспорт и инспекторы используют `SLIDEV_BROWSER_PATH` либо установленный браузер
Chromium (по умолчанию инспекторов — Yandex). Рисование в PDF отключено.

Не запускать dev, build и export параллельно, даже для разных лекций:
Slidev пишет общие generated-файлы внутри установленного client package.

## Структура

- `package.json`, lock-файл и `node_modules/` — общие для курса.
- `theme/` — локальная тема. Она подключает базовые стили theme-default,
  затем оформление курса; содержит `global-top.vue`, панель пера и компоненты.
- `theme/setup/macros.json` — адаптер из `../lectures/utils/newcommands.tex`.
  Обновление: `node tools/sync-notation.mjs`.
- `theme/assets/` — общие SVG taxonomy; экспорт: `tools/export-taxonomy.sh`.
- `lectureN/slides.md` — текст, формулы, раскрытия и заметки преподавателя.
  В headmatter: `theme: ../theme`.
- `lectureN/public/figs/` — локальные иллюстрации; в слайдах `src="/figs/name.png"`.
  Общие SVG подключает `TaxonomyDiagram` из темы через явные импорты;
  Использовать `class="taxonomy"` для размера эталонной Lecture 1.
  Выделение задаётся флагами `autoregressive`, `normalizing-flow`,
  `variational-autoencoder`, `generative-adversarial-network`, `score-matching`
  или `denoising-diffusion`.
- `lectureN/components/` и `lectureN/lib/` — демонстрации этой лекции.
- `lectureN/slide-map.json` и `migration.md` — карта и журнал переноса.
- `tools/` — общие команды, тесты и проверка PDF.
- `deferred/kl/` — сохранённый оригинал KL-демо; его копия используется в Lecture 5.
  [Заметки по повторному использованию](deferred-demos.md).

## Пометки занятия

Панель доступна постоянно в presenter mode или с `?tools`, без hover.
**Pen**, четыре цвета, **Undo**, **Redo**, **Save**, **Restore**, **Save & clear**.
Кнопки имеют область касания не менее 44 × 44 CSS px при масштабе 1.

- **Save** скачивает отдельный JSON со SVG-пометками всех слайдов. Сохранить
  его вместе с версией исходника лекции, использованной на занятии.
- **Save & clear** сначала скачивает архив сессии, затем очищает текущий слайд.
  Проверить загрузку файла перед закрытием браузера; браузер может блокировать
  автоматические скачивания. Остальные слайды сохраняются.
- **Restore** проверяет формат, название лекции, число слайдов и допустимое
  содержимое SVG. Если уже есть пометки, сначала скачивает текущую сессию,
  затем восстанавливает загруженную. SVG-архив не содержит историю Undo/Redo:
  после Restore она начинается заново, старые штрихи можно очистить целиком.
- Пометки относятся к логическому слайду и сохраняют координаты при раскрытиях.
  После изменения текста или геометрии слайдов старый архив может не совпасть:
  название и число слайдов не являются проверкой версии содержания.
- Постоянное автосохранение в исходник отключено. До закрытия страницы или
  остановки сервера нужно нажать Save. `sessions/` исключена из Git.
- Статическая сборка не предоставляет сервер для синхронизации разных устройств.
  Проверка реального пера, проектора и сетевой схемы ещё нужна.

## Интерактивная Lecture 1

- Гистограмма на слайде 31: 10 / 100 / 1000 / 10000 точек, Sample и Reset.
- Авторегрессия на слайде 41: Sampling / Density evaluation, Next pixel,
  Start over / Another image. Нажатие активного режима сохраняет шаг.
- Демонстрациями управлять в выводимом на экран окне: состояние виджетов
  между presenter и viewer не синхронизируется. В PDF предусмотрены
  статические примеры.

Исторические снимки и прототипы сохранены в `codex/slidev-before-interactivity`
(`1446c57`) и `codex/lecture01-interactivity`. Там используется прежняя папка
`slidev/`; рабочая структура на `main` — `lectures-slidev/`.

## Интерактивная Lecture 2

Демо якобиана объединено с исходным слайдом; AR и RealNVP добавлены после соответствующих исходных слайдов:

- Слайд 10: площадь и определитель якобиана — Identity / Shear / Stretch,
  ползунки Stretch / Shear, Reset.
- Слайд 23: Gaussian AR flow — Sampling / Density evaluation,
  Next coordinate / Compute all, Reset.
- Слайд 27: RealNVP — Apply layer, Invert last layer, Strength, Reset.

Во всех трёх демо статические примеры для PDF заданы отдельно. Управлять в
выводимом на экран окне: состояние между presenter/viewer не синхронизируется.
Браузерные сценарии: `node tools/inspect-flow-demos.mjs` при работающей Lecture 2.
Численные проверки входят в `npm run test:demos` и `npm run finalize -- 2`.

## Интерактивная Lecture 5

- Слайд 18: одна Gaussian-модель для смеси двух Gaussians — ползунки Mean / Std. deviation,
  Fit forward KL, Fit reverse KL: left / right, Reset.
- Демо продолжает исходное сравнение Jensen–Shannon и KL на слайде 17;
  иллюстрация JSD сохранена. Reverse-KL fitting не отождествляется с GAN training.
- В PDF показаны оба подготовленных решения: forward KL и один симметричный минимум reverse KL.
  Состояние ползунков сохраняется при возврате на слайд; управлять демо в выводимом
  на экран окне, синхронизация с presenter/viewer не предполагается.

Численные проверки сохранённого KL-демо входят в `npm run test:demos`.
Проверенные сценарии управления и экспорта: [журнал Lecture 5](lecture5/migration.md).
