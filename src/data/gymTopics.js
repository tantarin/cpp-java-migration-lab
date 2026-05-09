export const gymTopics = [
  {
    id: "memory",
    title: "Управление памятью",
    badge: "Память",
    badgeColor: "orange",
    description: "В C++ память управляется вручную. Java использует сборщик мусора (GC). Это одно из ключевых различий при миграции.",
    keyDiffs: [
      "C++ new/delete → Java GC (автоматически)",
      "RAII (деструктор) → try-with-resources / AutoCloseable",
      "unique_ptr → нет прямого аналога, GC справляется",
      "shared_ptr → нет прямого аналога (подсчёт ссылок не нужен)"
    ],
    cpp: `#include <memory>
#include <string>

// Старый стиль — ручное управление
class SpamFilter {
    int* scores;
    size_t size;
public:
    SpamFilter(size_t n) : size(n) {
        scores = new int[n];  // выделяем кучу
    }
    ~SpamFilter() {
        delete[] scores;      // обязательно освобождаем
    }
};

// Современный C++ — умные указатели (RAII)
void example() {
    // unique_ptr — единственный владелец
    auto filter = std::make_unique<SpamFilter>(100);
    // удалится автоматически при выходе из scope

    // shared_ptr — разделяемое владение
    auto shared = std::make_shared<SpamFilter>(100);
    auto copy = shared; // счётчик ссылок = 2
    // удалится когда счётчик = 0
}`,
    java: `// Java: GC управляет памятью автоматически
public class SpamFilter {
    private int[] scores;

    public SpamFilter(int n) {
        scores = new int[n]; // GC сам освободит
        // деструктора нет — не нужен
    }
}

// Для внешних ресурсов (файлы, соединения)
// используй try-with-resources — аналог RAII
public void processFile(String path) throws IOException {
    try (BufferedReader reader =
             new BufferedReader(new FileReader(path))) {
        // reader.close() вызовется автоматически
        String line;
        while ((line = reader.readLine()) != null) {
            classify(line);
        }
    }
    // unique_ptr / shared_ptr → не нужны:
    // GC сам определяет когда объект недостижим
}`,
    quiz: {
      question: "Что произойдёт с объектом SpamFilter после выхода из функции, если он создан через make_unique?",
      answer: "Деструктор вызовется автоматически, память освободится. В Java аналогичный объект просто станет недостижимым — GC освободит его в неопределённый момент позже. Ключевое отличие: C++ освобождает детерминированно (сразу), Java — недетерминированно."
    }
  },
  {
    id: "pointers",
    title: "Указатели и ссылки",
    badge: "Указатели",
    badgeColor: "red",
    description: "C++ разделяет указатели (адреса в памяти) и ссылки (алиасы). В Java все объектные переменные — ссылки, сырых указателей нет.",
    keyDiffs: [
      "C++ int* ptr — адрес в памяти, может быть nullptr",
      "C++ *ptr — разыменование, & — взятие адреса",
      "C++ ссылка (Type&) — алиас, не может быть null",
      "Java ссылка — всегда на объект в heap или null → NPE"
    ],
    cpp: `#include <string>
#include <memory>
#include <optional>

// Сырой указатель — адрес в памяти
int value = 42;
int* ptr = &value;    // ptr = адрес переменной value
*ptr = 100;           // разыменование: изменяем value через ptr

// Указатель может быть null
SpamFilter* filter = nullptr;
if (filter != nullptr) {
    filter->classify(msg);  // -> вместо . для указателей
}

// C++ ссылка — алиас, не может быть null,
// нельзя переназначить на другой объект
void process(const std::string& msg) {
    // msg — алиас оригинала, без копирования
    // const & — read-only, безопасно
}

// std::optional — явный nullable (C++17)
std::optional<SpamFilter> maybeFilter;
if (maybeFilter.has_value()) {
    maybeFilter->classify(msg);
}`,
    java: `import java.util.Optional;

// Java: нет указателей
// Все переменные объектных типов — ссылки
String s = "hello"; // s — ссылка на объект в heap
// нет & для адресов, нет * для разыменования
// нет -> всегда используем .

// "null pointer" → NullPointerException
SpamFilter filter = null;
// filter.classify(msg); // NullPointerException!

// Всегда проверяй null или используй Optional
Optional<SpamFilter> maybeFilter = Optional.empty();
maybeFilter.ifPresent(f -> f.classify(msg));

// Передача объекта — по ссылке (как C++ &)
// но нельзя переназначить оригинальную ссылку
void process(String msg) {
    // msg — ссылка на тот же объект что у вызывателя
    // String иммутабелен — безопасно
    msg = "new value"; // переназначает локальную копию ссылки
    // на оригинальный объект НЕ влияет
}

// Примитивы (int, double) — передаются по значению
void increment(int x) {
    x++; // не влияет на оригинал
}`,
    quiz: {
      question: "В C++ есть функция void fill(std::vector<int>& vec). Как передать вектор без копирования в Java-эквиваленте?",
      answer: "В Java объекты (в том числе List) передаются по ссылке автоматически — просто void fill(List<Integer> list). Копирования не происходит. В C++ & нужен явно, чтобы избежать копии. В Java примитивы (int, double) — единственное исключение, они копируются."
    }
  },
  {
    id: "collections",
    title: "STL vs Java Collections",
    badge: "Коллекции",
    badgeColor: "green",
    description: "STL-контейнеры C++ и Java Collections имеют почти полное соответствие, но с разным синтаксисом и семантикой владения.",
    keyDiffs: [
      "std::vector → ArrayList (динамический массив)",
      "std::map → TreeMap (красно-чёрное дерево, упорядоченный)",
      "std::unordered_map → HashMap (хэш-таблица)",
      "std::set → TreeSet, unordered_set → HashSet",
      "std::queue → Queue/Deque, std::stack → Deque"
    ],
    cpp: `#include <vector>
#include <map>
#include <unordered_map>
#include <set>
#include <algorithm>

// vector — динамический массив
std::vector<std::string> keywords = {"spam", "free"};
keywords.push_back("win");
keywords[0] = "SPAM";
size_t sz = keywords.size();

// map — упорядоченный (красно-чёрное дерево)
std::map<std::string, int> wordCount;
wordCount["spam"] = 10;
wordCount["free"]++;

// unordered_map — хэш-таблица, O(1) среднее
std::unordered_map<std::string, double> scores;
scores["phishing"] = 0.95;
scores.count("phishing"); // 1 если есть, 0 если нет

// Итерация — range-based for + structured bindings (C++17)
for (const auto& [word, score] : scores) {
    std::cout << word << ": " << score << "\\n";
}

// Алгоритмы из <algorithm>
std::sort(keywords.begin(), keywords.end());
auto it = std::find(keywords.begin(), keywords.end(), "spam");`,
    java: `import java.util.*;
import java.util.stream.*;

// ArrayList — динамический массив (аналог vector)
List<String> keywords = new ArrayList<>(List.of("spam", "free"));
keywords.add("win");
keywords.set(0, "SPAM");
int sz = keywords.size();

// TreeMap — упорядоченный (аналог std::map)
Map<String, Integer> wordCount = new TreeMap<>();
wordCount.put("spam", 10);
wordCount.merge("free", 1, Integer::sum); // удобный increment

// HashMap — хэш-таблица (аналог unordered_map)
Map<String, Double> scores = new HashMap<>();
scores.put("phishing", 0.95);
scores.containsKey("phishing"); // boolean

// Итерация
for (Map.Entry<String, Double> e : scores.entrySet()) {
    System.out.println(e.getKey() + ": " + e.getValue());
}
// или лямбда (лаконичнее)
scores.forEach((word, score) ->
    System.out.println(word + ": " + score));

// Алгоритмы — Streams API
List<String> sorted = keywords.stream()
    .sorted()
    .collect(Collectors.toList());
boolean hasSpam = keywords.contains("spam");`,
    quiz: {
      question: "C++ код: scores.count(\"key\") возвращает 0 или 1 для unordered_map. Что использовать в Java HashMap?",
      answer: "scores.containsKey(\"key\") возвращает boolean. Альтернатива: scores.get(\"key\") != null (но осторожно если значение может быть null). Для безопасного получения с дефолтом: scores.getOrDefault(\"key\", 0.0)."
    }
  },
  {
    id: "templates",
    title: "Шаблоны vs Generics",
    badge: "Обобщения",
    badgeColor: "purple",
    description: "C++ шаблоны — compile-time генерация кода (duck typing). Java Generics — проверка типов на этапе компиляции с type erasure в рантайме.",
    keyDiffs: [
      "C++ template<T> → новый код для каждого T (compile-time)",
      "Java <T> → стирание типов, в байткоде T → Object/bound",
      "C++ duck typing: ошибка только если используемый метод отсутствует",
      "Java: нужен bound (extends) чтобы вызывать методы T",
      "C++ нет ограничений по умолчанию, Java — type-safe"
    ],
    cpp: `#include <vector>
#include <string>

// Шаблонный класс — компилятор создаёт
// отдельную версию для каждого типа T
template<typename T>
class Classifier {
    std::vector<T> rules;
public:
    void addRule(const T& rule) {
        rules.push_back(rule);
    }
    // Classifier<RegexRule> и Classifier<MLRule>
    // — это два разных класса в бинарнике
};

// Шаблонная функция
template<typename T>
T maxScore(T a, T b) {
    return a > b ? a : b;
    // Компилируется только если у T есть operator>
    // Ошибка будет при инстанциации, не при объявлении
}

// Duck typing — нет явного интерфейса
template<typename Filter>
void applyFilter(Filter& f, const std::string& msg) {
    f.classify(msg);
    // Ошибка только если у Filter нет метода classify
}

// Специализация шаблона для конкретного типа
template<>
class Classifier<std::string> {
    // особая реализация для строк
};`,
    java: `import java.util.*;
import java.util.function.*;

// Generic класс — в байткоде T заменяется на Object или bound
// Один класс для всех T (в отличие от C++)
public class Classifier<T extends Rule> {
    private final List<T> rules = new ArrayList<>();

    public void addRule(T rule) {
        rules.add(rule);
    }
    // extends Rule — нужен чтобы вызывать методы Rule
    // без него T → Object, можно только equals/toString
}

// Generic метод с ограничением
public <T extends Comparable<T>> T maxScore(T a, T b) {
    return a.compareTo(b) > 0 ? a : b;
    // Comparable нужен для сравнения — нет duck typing
}

// Нет duck typing — нужен интерфейс
public interface Classifiable {
    void classify(String msg);
}

public void applyFilter(Classifiable f, String msg) {
    f.classify(msg); // ошибка компиляции если не реализует
}

// Нет специализации — используй перегрузку или паттерн
// Visitor для разного поведения по типу`,
    quiz: {
      question: "Почему в Java нельзя написать new T() внутри generic класса, а в C++ template можно?",
      answer: "В Java из-за type erasure: в рантайме тип T неизвестен, JVM не знает какой конструктор вызвать. В C++ шаблон — compile-time, компилятор знает T и генерирует конкретный код. В Java решение: передать Class<T> или Supplier<T> как параметр."
    }
  },
  {
    id: "threading",
    title: "Многопоточность",
    badge: "Потоки",
    badgeColor: "blue",
    description: "В высоконагруженных системах обработки спама многопоточность критична. C++ и Java предоставляют схожие примитивы, но с разным API.",
    keyDiffs: [
      "std::thread → Thread / ExecutorService / CompletableFuture",
      "std::mutex → synchronized / ReentrantLock",
      "std::condition_variable → Object.wait/notify или Condition",
      "std::atomic<T> → AtomicInteger, AtomicReference и др.",
      "std::queue + mutex → BlockingQueue (встроенная синхронизация)"
    ],
    cpp: `#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <atomic>

std::queue<Message> msgQueue;
std::mutex queueMutex;
std::condition_variable cv;
std::atomic<bool> running{true};

// Поток-потребитель
std::thread worker([&]() {
    while (running) {
        std::unique_lock<std::mutex> lock(queueMutex);
        cv.wait(lock, [&] {
            return !msgQueue.empty() || !running;
        });
        if (!msgQueue.empty()) {
            Message msg = msgQueue.front();
            msgQueue.pop();
            lock.unlock();
            processMessage(msg);
        }
    }
});

// Поток-производитель
{
    std::lock_guard<std::mutex> lock(queueMutex);
    msgQueue.push(newMsg);
}
cv.notify_one();

running = false;
cv.notify_all();
worker.join();`,
    java: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

// BlockingQueue — встроенная синхронизация
// не нужны ни mutex ни condition_variable
BlockingQueue<Message> msgQueue =
    new LinkedBlockingQueue<>(1000); // с лимитом ёмкости

AtomicBoolean running = new AtomicBoolean(true);

// ExecutorService — пул потоков (лучше чем raw Thread)
ExecutorService executor =
    Executors.newFixedThreadPool(4);

// Поток-потребитель
executor.submit(() -> {
    while (running.get()) {
        try {
            // take() блокирует пока очередь пуста
            Message msg = msgQueue.poll(
                100, TimeUnit.MILLISECONDS);
            if (msg != null) processMessage(msg);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            break;
        }
    }
});

// Поток-производитель (потокобезопасно без lock)
msgQueue.put(newMsg); // блокирует если очередь полна

// Остановка
running.set(false);
executor.shutdown();
executor.awaitTermination(5, TimeUnit.SECONDS);`,
    quiz: {
      question: "Почему в Java примере нет явного mutex и condition_variable, но код всё равно потокобезопасен?",
      answer: "BlockingQueue инкапсулирует синхронизацию внутри. take() использует внутренний ReentrantLock + Condition — это Java-эквиваленты mutex + condition_variable. Это идиома 'prefer higher-level concurrency objects' из Effective Java. В production-коде Яндекса именно так — BlockingQueue вместо ручных блокировок."
    }
  },
  {
    id: "headers",
    title: "Заголовочные файлы",
    badge: "Структура",
    badgeColor: "gray",
    description: "C++ разделяет объявление (.h) и реализацию (.cpp). В Java всё в одном файле. Понимание .h файлов критично для чтения легаси C++.",
    keyDiffs: [
      ".h файл — интерфейс класса: что есть, но не как работает",
      ".cpp файл — реализация: как работает",
      "#include — буквальная вставка файла препроцессором",
      "#pragma once / include guards — защита от двойного включения",
      "Java package = C++ namespace, import = #include (но умнее)"
    ],
    cpp: `// spam_filter.h — ОБЪЯВЛЕНИЕ (что есть)
#pragma once          // включить этот файл только один раз

#include <string>     // нужно для std::string в объявлении
#include <vector>

namespace antispam {  // пространство имён

class SpamFilter {
public:
    // Конструктор
    explicit SpamFilter(double threshold);

    // Методы — только сигнатуры, без тела
    bool isSpam(const std::string& message) const;
    void addKeyword(std::string keyword);
    double getScore() const;

private:
    double threshold_;          // поле
    std::vector<std::string> keywords_;
};

} // namespace antispam

// -------------------------------------------
// spam_filter.cpp — РЕАЛИЗАЦИЯ (как работает)
#include "spam_filter.h"  // включаем наш заголовок
#include <algorithm>
#include <cctype>

namespace antispam {

SpamFilter::SpamFilter(double threshold)
    : threshold_(threshold) {} // список инициализации

bool SpamFilter::isSpam(const std::string& msg) const {
    // реализация здесь
    return false;
}

} // namespace antispam`,
    java: `// Java: нет заголовочных файлов
// SpamFilter.java — объявление и реализация вместе

package com.yandex.antispam; // аналог namespace

import java.util.List;      // аналог #include, но умнее:
import java.util.ArrayList; // компилятор сам находит файл

public class SpamFilter {
    // Поля
    private final double threshold;
    private final List<String> keywords;

    // Конструктор
    public SpamFilter(double threshold) {
        this.threshold = threshold;
        this.keywords = new ArrayList<>();
    }

    // Методы — объявление И реализация вместе
    public boolean isSpam(String message) {
        String lower = message.toLowerCase();
        return keywords.stream()
            .anyMatch(lower::contains);
    }

    public void addKeyword(String keyword) {
        keywords.add(keyword.toLowerCase());
    }

    public double getThreshold() {
        return threshold;
    }
}
// Видимость управляется модификаторами:
// public — везде, protected — пакет + наследники,
// (default) — только пакет, private — только класс`,
    quiz: {
      question: "Зачем в C++ #pragma once (или include guards)? Что будет без них?",
      answer: "Без protect guard один .h файл может быть включён несколько раз через разные цепочки #include. Это вызовет ошибку 'класс уже объявлен'. #pragma once говорит препроцессору: этот файл уже обработан, пропусти. В Java этой проблемы нет — компилятор сам следит за уникальностью классов по пакету."
    }
  }
];
