# DGM course in Slidev

Параллельная версия курса: Beamer-исходники и PDF остаются в `../lectures/`.
Весь Slidev использует один набор зависимостей и общую локальную тему.
Обязательные правила и порядок переноса: [MIGRATION.md](MIGRATION.md).

Навыки проекта: [slidev-migrate](../.agents/skills/slidev-migrate/SKILL.md) для
переноса, [lecture-audit](../.agents/skills/lecture-audit/SKILL.md) для полного аудита.
Notation, Recap, Summary и README проверяются теми же проектными навыками в режиме
Slidev. Общий навык PDF помогает просматривать экспорт; формулы и раскрытия
проверяются также по исходникам и в браузере.

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
| 9 | [slides.md](lecture9/slides.md) | [Lecture9.pdf](lecture9/Lecture9.pdf) | [Lecture9-handout.pdf](lecture9/Lecture9-handout.pdf) | [migration.md](lecture9/migration.md) |
| 10 | [slides.md](lecture10/slides.md) | [Lecture10.pdf](lecture10/Lecture10.pdf) | [Lecture10-handout.pdf](lecture10/Lecture10-handout.pdf) | [migration.md](lecture10/migration.md) |
| 11 | [slides.md](lecture11/slides.md) | [Lecture11.pdf](lecture11/Lecture11.pdf) | [Lecture11-handout.pdf](lecture11/Lecture11-handout.pdf) | [migration.md](lecture11/migration.md) |
| 12 | [slides.md](lecture12/slides.md) | [Lecture12.pdf](lecture12/Lecture12.pdf) | [Lecture12-handout.pdf](lecture12/Lecture12-handout.pdf) | [migration.md](lecture12/migration.md) |
| 13 | [slides.md](lecture13/slides.md) | [Lecture13.pdf](lecture13/Lecture13.pdf) | [Lecture13-handout.pdf](lecture13/Lecture13-handout.pdf) | [migration.md](lecture13/migration.md) |
| 14 | [slides.md](lecture14/slides.md) | [Lecture14.pdf](lecture14/Lecture14.pdf) | [Lecture14-handout.pdf](lecture14/Lecture14-handout.pdf) | [migration.md](lecture14/migration.md) |

Lecture 14 сохраняет текущую черновую редакцию Beamer; статус содержания и
согласованные ограничения описаны в [журнале переноса](lecture14/migration.md).

## Запуск

Версия Node задана в [.nvmrc](.nvmrc), зависимости — в lock-файле.
Из корня репозитория:

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
- Lecture 9: `http://localhost:3039/` (`npm run dev -- 9`).
- Lecture 10: `http://localhost:3040/` (`npm run dev -- 10`).
- Lecture 11: `http://localhost:3041/` (`npm run dev -- 11`).
- Lecture 12: `http://localhost:3042/` (`npm run dev -- 12`).
- Lecture 13: `http://localhost:3043/` (`npm run dev -- 13`).
- Lecture 14: `http://localhost:3044/` (`npm run dev -- 14`).
- Режим преподавателя: `http://localhost:3031/presenter/1`.
- Показ с закреплённой панелью пера: `http://localhost:3031/1?tools`.
- Arrow Right / Space — следующий шаг; Arrow Left — предыдущий.
- Кнопки переходов в панели работают и при включённом пере.
- Сервер по умолчанию доступен только с этого компьютера. Доступ отдельного
  планшета по сети требует отдельно настроенного и разрешённого сетевого режима.

## Завершение миграции и PDF

Для получения окончательных артефактов остановить dev-серверы общего проекта
и выполнить (заменить 1 на номер лекции):

```sh
npm run finalize -- 1
```

Команда проверяет покрытие исходных frames, согласованность карты, наличие
разделов и ссылок, распознанные изображения и макросы; запускает существующие
тесты, собирает веб-версию и **оба PDF**. Экспорт проверяет число страниц по карте
и обновляет файлы рядом с выбранной лекцией только после успеха обоих вариантов:

- `lectureN/LectureN.pdf` — все раскрытия.
- `lectureN/LectureN-handout.pdf` — финальные состояния логических слайдов.

Актуальные числа страниц и результаты проверок хранятся в журнале каждой лекции.
Критерии завершения и состав коммита заданы в `MIGRATION.md` §7.
Промежуточные PDF, веб-сборка, QA и зависимости исключены из Git;
Beamer PDF и `lectures/merged/` команда не меняет.

Отдельные этапы: `npm run check -- 1`, `npm run build -- 1`,
`npm run export -- 1`, `npm run test:demos`.

Для визуальной проверки всех страниц:

```sh
python tools/render-qa.py 1
```

Нужны Python-пакеты `pypdf`, `pypdfium2`, `Pillow`. Скрипт проверяет число страниц,
извлекает текст и создаёт контактные листы в `output/qa/lecture1/`.
Рендер QA, браузерные инспекторы и визуальный просмотр не входят в `finalize`.
Контактные листы помогают проверить все страницы; плотные места смотреть крупно.

После экспорта снова запустить `npm run dev -- 1`. При работающем сервере:

```sh
node tools/inspect.mjs 1
node tools/inspect-demos.mjs 1
```

`inspect.mjs N` проверяет раскрытия по карте и границы содержимого;
сценарии пера в нём сейчас покрывают Lecture 1. Для демо выбирать инспектор
соответствующей лекции из разделов ниже. `SLIDEV_QA_URL` меняет адрес сервера.
`SLIDEV_BROWSER_PATH` задаёт путь к Chromium-браузеру; по умолчанию инспекторы
используют Yandex в macOS. Инспекторы проверяют реализованные сценарии и не заменяют
визуальный просмотр; при изменении механизма сверять охват с кодом в `tools/`.

Dev-серверы разных лекций можно запускать параллельно: у каждой свой порт,
generated-файлы и кэш Vite в `lectureN/node_modules/.vite`, заданный общей темой.
Перед build/export по-прежнему останавливать dev-серверы; сборку и экспорт
выполнять последовательно.

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
  `variational-autoencoder`, `generative-adversarial-network`, `score-matching`,
  `denoising-diffusion`, `continuous-normalizing-flow`, `sde-based-diffusion`,
  `flow-matching`, `discrete-diffusion` или `absorbing-diffusion`.
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
- Автосохранение на диск отключено. До закрытия страницы или
  остановки сервера нужно нажать Save. `sessions/` исключена из Git.
- Статическая сборка не предоставляет сервер для синхронизации разных устройств.
  Проверка реального пера, проектора и сетевой схемы ещё нужна.

## Интерактивная Lecture 1

- Гистограмма: 10 / 100 / 1000 / 10000 точек, Sample и Reset.
- Авторегрессия: Sampling / Density evaluation, Next pixel,
  Start over / Another image. Нажатие активного режима сохраняет шаг.
- Демонстрациями управлять в выводимом на экран окне: состояние виджетов
  между presenter и viewer не синхронизируется. В PDF предусмотрены
  статические примеры.

Сценарии браузера: `node tools/inspect-demos.mjs 1`.
История вариантов и текущие сценарии: [журнал Lecture 1](lecture1/migration.md).
Отложенные демонстрации: [deferred-demos.md](deferred-demos.md).

## Интерактивная Lecture 2

Демо якобиана и AR объединены с соответствующей теорией; демо RealNVP следует за её разбором:

- Слайд 10: площадь и определитель якобиана — Identity / Shear / Stretch,
  ползунки Stretch / Shear, Reset.
- Слайд 21: Gaussian AR flow — Sampling / Density evaluation,
  Next coordinate / Compute all, Reset.
- Слайд 25: RealNVP — Apply layer, Invert last layer, Strength, Reset.

Во всех трёх демо статические примеры для PDF заданы отдельно. Управлять в
выводимом на экран окне: состояние между presenter/viewer не синхронизируется.
Браузерные сценарии: `node tools/inspect-flow-demos.mjs` при работающей Lecture 2.
Численные проверки входят в `npm run test:demos` и `npm run finalize -- 2`.

## Интерактивная Lecture 3

- Слайд 14: вариационный Gaussian posterior и зазор ELBO. Poor / Better / Exact,
  ползунки среднего и стандартного отклонения, Reset. Модель и наблюдение фиксированы.
- Слайд 19: отдельные оптимизации для наблюдений и один общий encoder;
  три раскрытия штатными кликами Slidev.
- Слайды 23–26: смысловые цвета и жирное выделение зависимостей от θ / φ.

Состояние ползунков сохраняется при уходе со слайда и возврате. Управлять демо
в выводимом на экран окне: между presenter/viewer состояние компонентов
не синхронизируется. PDF содержит все три подготовленных примера демо ELBO.

Браузерные сценарии: `node tools/inspect-variational-demos.mjs` при работающей Lecture 3.
Два численных теста входят в `npm run test:demos` и `npm run finalize -- 3`.
Подробности и проверенные ограничения: [журнал Lecture 3](lecture3/migration.md).

## Интерактивная Lecture 4

- Слайд 14: фиксированный encoder, Gaussian / Matched prior; Marginal KL,
  mutual information и средний conditional KL. Смена prior сохраняет MI.
- Слайд 23: определение quantization и интерактивная двумерная схема:
  восемь нерегулярно расположенных кодов, границы Voronoi и перемещаемая точка.
  Кнопок и настроек нет; для клавиатуры доступны стрелки и Home на выбранной точке.
- Слайд 26: путь forward и копирование градиента в straight-through estimator
  раскрываются штатными кликами вместе с существующим выводом.
- Слайд 37: Gaussian data/model densities и точный оптимальный discriminator;
  ползунок среднего generator, Separated / Overlap / Matched и Reset.

PDF содержит сравнения prior и discriminator и фиксированную схему quantization. Состояние
управления сохраняется при возврате на слайд. Управлять в выводимом на экран
окне; синхронизация компонентов между presenter/viewer не реализована.
При включённом пере график квантования остаётся доступен для пометок,
а перетаскивание точки отключено.

Численные проверки: `node --test tools/test-latent-demos.mjs` (также входят
в `npm run test:demos` и `finalize`). Браузерные сценарии:
`node tools/inspect-latent-demos.mjs` при работающей Lecture 4.
Проверенные сценарии и ограничения: [журнал Lecture 4](lecture4/migration.md).

## Интерактивная Lecture 5

- Слайд 13: одна Gaussian-модель для смеси двух Gaussians — ползунки Mean / Std. deviation,
  Fit forward KL, Fit reverse KL: left / right, Reset.
- Демо продолжает исходное сравнение Jensen–Shannon и KL на слайде 12;
  иллюстрация JSD сохранена. Reverse-KL fitting не отождествляется с GAN training.
- В PDF показаны оба подготовленных решения: forward KL и один симметричный минимум reverse KL.
  Состояние ползунков сохраняется при возврате на слайд; управлять демо в выводимом
  на экран окне, синхронизация с presenter/viewer не предполагается.

Численные проверки сохранённого KL-демо входят в `npm run test:demos`.
Проверенные сценарии управления и экспорта: [журнал Lecture 5](lecture5/migration.md).
