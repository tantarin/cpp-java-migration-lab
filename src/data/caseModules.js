export const caseModules = [
  {
    id: "parser",
    title: "MessageParser",
    subtitle: "Парсинг входящих сообщений",
    description: "Первый компонент пайплайна — парсинг raw email/сообщения. Нужно распознать заголовки (From, Subject) и тело. Мигрируем с C++ struct + string к Java record + String API.",
    concepts: ["struct → record", "std::string → String", "std::istringstream → Scanner/split", "std::getline → BufferedReader"],
    cpp: `#include <string>
#include <sstream>
#include <unordered_map>

// POD-структура для данных сообщения
struct ParsedMessage {
    std::string sender;
    std::string subject;
    std::string body;
    std::unordered_map<std::string, std::string> headers;
};

class MessageParser {
public:
    ParsedMessage parse(const std::string& raw) {
        ParsedMessage result;
        std::istringstream stream(raw);
        std::string line;
        bool inBody = false;

        while (std::getline(stream, line)) {
            if (line.empty()) {
                inBody = true;
                continue;
            }
            if (inBody) {
                result.body += line + "\\n";
            } else {
                auto colonPos = line.find(':');
                if (colonPos != std::string::npos) {
                    std::string key = line.substr(0, colonPos);
                    std::string val = line.substr(colonPos + 2);
                    result.headers[key] = val;
                    if (key == "From")    result.sender = val;
                    if (key == "Subject") result.subject = val;
                }
            }
        }
        return result; // возвращается по значению (копия)
    }
};`,
    java: `import java.util.*;

// record — иммутабельный data class (Java 16+)
// аналог C++ struct с геттерами и equals/hashCode
public record ParsedMessage(
    String sender,
    String subject,
    String body,
    Map<String, String> headers
) {}

public class MessageParser {
    public ParsedMessage parse(String raw) {
        Map<String, String> headers = new LinkedHashMap<>();
        StringBuilder body = new StringBuilder();
        boolean inBody = false;

        for (String line : raw.split("\\n")) {
            if (line.isEmpty()) {
                inBody = true;
                continue;
            }
            if (inBody) {
                body.append(line).append("\\n");
            } else {
                int colonPos = line.indexOf(':');
                if (colonPos != -1) {
                    String key = line.substring(0, colonPos).trim();
                    String val = line.substring(colonPos + 1).trim();
                    headers.put(key, val);
                }
            }
        }

        // record создаётся через canonical constructor
        return new ParsedMessage(
            headers.getOrDefault("From", ""),
            headers.getOrDefault("Subject", ""),
            body.toString(),
            Collections.unmodifiableMap(headers)
        );
    }
}`,
    notes: [
      "struct в C++ — просто class с public по умолчанию. Java record — иммутабельный класс-носитель данных.",
      "std::istringstream + getline → String.split() или BufferedReader.readLine()",
      "В C++ результат возвращается по значению (RVO оптимизирует). В Java объекты всегда на heap.",
      "unordered_map → LinkedHashMap сохраняет порядок вставки, что удобно для заголовков"
    ]
  },
  {
    id: "rules",
    title: "RuleEngine",
    subtitle: "Движок правил классификации спама",
    description: "Rule Engine применяет набор правил к сообщению и возвращает оценку. В C++ используются шаблоны и std::function. В Java — функциональные интерфейсы и Stream API.",
    concepts: ["template → generics + interface", "std::function → Function/Predicate", "vector<function> → List<Predicate>", "lambda → lambda"],
    cpp: `#include <vector>
#include <functional>
#include <string>
#include <numeric>

// Тип правила — функция: сообщение → оценка спама
using SpamRule = std::function<double(const std::string&)>;

class RuleEngine {
    std::vector<SpamRule> rules_;
    double threshold_;

public:
    explicit RuleEngine(double threshold = 0.5)
        : threshold_(threshold) {}

    void addRule(SpamRule rule) {
        rules_.push_back(std::move(rule));
    }

    double score(const std::string& message) const {
        if (rules_.empty()) return 0.0;

        double total = std::accumulate(
            rules_.begin(), rules_.end(), 0.0,
            [&](double sum, const SpamRule& rule) {
                return sum + rule(message);
            }
        );
        return total / rules_.size();
    }

    bool isSpam(const std::string& message) const {
        return score(message) >= threshold_;
    }
};

// Использование
RuleEngine engine(0.6);
engine.addRule([](const std::string& msg) {
    return msg.find("FREE") != std::string::npos ? 1.0 : 0.0;
});
engine.addRule([](const std::string& msg) {
    return msg.find("WIN") != std::string::npos ? 0.8 : 0.0;
});`,
    java: `import java.util.*;
import java.util.function.*;
import java.util.stream.*;

// ToDoubleFunction<String> — аналог std::function<double(const string&)>
public class RuleEngine {
    private final List<ToDoubleFunction<String>> rules =
        new ArrayList<>();
    private final double threshold;

    public RuleEngine(double threshold) {
        this.threshold = threshold;
    }

    public void addRule(ToDoubleFunction<String> rule) {
        rules.add(rule);
    }

    public double score(String message) {
        if (rules.isEmpty()) return 0.0;

        return rules.stream()
            .mapToDouble(rule -> rule.applyAsDouble(message))
            .average()
            .orElse(0.0);
    }

    public boolean isSpam(String message) {
        return score(message) >= threshold;
    }
}

// Использование — лямбды как в C++
RuleEngine engine = new RuleEngine(0.6);
engine.addRule(msg ->
    msg.contains("FREE") ? 1.0 : 0.0);
engine.addRule(msg ->
    msg.contains("WIN") ? 0.8 : 0.0);

// Дополнительно: можно использовать Predicate<String>
// если нужен boolean, а не double score`,
    notes: [
      "std::function<double(string)> → ToDoubleFunction<String> (специализация для double, без boxing)",
      "std::accumulate с лямбдой → Stream.mapToDouble().average()",
      "Лямбды в C++ и Java синтаксически похожи, семантика отличается в захвате переменных",
      "В Java лямбды захватывают effectively final переменные. В C++ явно: [&] или [=]"
    ]
  },
  {
    id: "features",
    title: "FeatureExtractor",
    subtitle: "Извлечение признаков для ML-модели",
    description: "Для ML-классификатора нужно превратить текст в вектор числовых признаков. Мигрируем C++ подход с map<string, double> на Java Streams и функциональный стиль.",
    concepts: ["map<string,double> → Map<String,Double>", "struct → record", "range-for → forEach/stream", "C++ lambdas → Java lambdas"],
    cpp: `#include <string>
#include <map>
#include <vector>
#include <sstream>
#include <algorithm>
#include <cctype>

using Features = std::map<std::string, double>;

class FeatureExtractor {
public:
    Features extract(const std::string& text) const {
        Features features;

        // Длина сообщения
        features["length"] = static_cast<double>(text.size());

        // Доля заглавных букв
        long upperCount = std::count_if(
            text.begin(), text.end(), ::isupper);
        features["caps_ratio"] =
            text.empty() ? 0.0 : upperCount / (double)text.size();

        // Количество слов
        std::istringstream stream(text);
        std::string word;
        int wordCount = 0;
        while (stream >> word) wordCount++;
        features["word_count"] = wordCount;

        // Наличие спам-слов
        const std::vector<std::string> spamWords = {
            "free", "win", "click", "offer"
        };
        int spamHits = 0;
        std::string lower = text;
        std::transform(lower.begin(), lower.end(),
                       lower.begin(), ::tolower);
        for (const auto& sw : spamWords) {
            if (lower.find(sw) != std::string::npos) spamHits++;
        }
        features["spam_word_count"] = spamHits;

        return features;
    }
};`,
    java: `import java.util.*;
import java.util.stream.*;

public class FeatureExtractor {
    private static final List<String> SPAM_WORDS =
        List.of("free", "win", "click", "offer");

    public Map<String, Double> extract(String text) {
        Map<String, Double> features = new LinkedHashMap<>();
        String lower = text.toLowerCase();

        // Длина сообщения
        features.put("length", (double) text.length());

        // Доля заглавных букв
        long upperCount = text.chars()
            .filter(Character::isUpperCase)
            .count();
        features.put("caps_ratio",
            text.isEmpty() ? 0.0 : upperCount / (double) text.length());

        // Количество слов (split по пробельным символам)
        long wordCount = Arrays.stream(text.split("\\\\s+"))
            .filter(w -> !w.isEmpty())
            .count();
        features.put("word_count", (double) wordCount);

        // Наличие спам-слов
        long spamHits = SPAM_WORDS.stream()
            .filter(lower::contains)
            .count();
        features.put("spam_word_count", (double) spamHits);

        return Collections.unmodifiableMap(features);
    }
}`,
    notes: [
      "map<string,double> → LinkedHashMap<String,Double> (сохраняет порядок вставки, важно для воспроизводимости)",
      "std::count_if + итераторы → text.chars().filter().count() (Stream API)",
      "std::transform + tolower → String.toLowerCase() (гораздо лаконичнее)",
      "Java Streams ленивые: вычисляются только при терминальной операции (count, collect и т.д.)"
    ]
  },
  {
    id: "queue",
    title: "ConcurrentProcessor",
    subtitle: "Высоконагруженная обработка очереди",
    description: "Обработка десятков тысяч сообщений в секунду. C++ использует std::queue + mutex + condition_variable. Java — BlockingQueue + ExecutorService. Производительность и корректность — главные цели.",
    concepts: ["std::thread → ExecutorService", "std::mutex + CV → BlockingQueue", "std::atomic → AtomicInteger", "join() → shutdown() + awaitTermination()"],
    cpp: `#include <queue>
#include <mutex>
#include <condition_variable>
#include <thread>
#include <atomic>
#include <vector>
#include <functional>

class ConcurrentProcessor {
    std::queue<Message> queue_;
    std::mutex mutex_;
    std::condition_variable cv_;
    std::atomic<bool> running_{true};
    std::atomic<long> processed_{0};
    std::vector<std::thread> workers_;

public:
    explicit ConcurrentProcessor(int numThreads) {
        for (int i = 0; i < numThreads; ++i) {
            workers_.emplace_back([this] { workerLoop(); });
        }
    }

    void submit(Message msg) {
        {
            std::lock_guard<std::mutex> lock(mutex_);
            queue_.push(std::move(msg));
        }
        cv_.notify_one();
    }

    void shutdown() {
        running_ = false;
        cv_.notify_all();
        for (auto& t : workers_) t.join();
    }

    long processedCount() const { return processed_; }

private:
    void workerLoop() {
        while (true) {
            std::unique_lock<std::mutex> lock(mutex_);
            cv_.wait(lock, [this] {
                return !queue_.empty() || !running_;
            });
            if (queue_.empty() && !running_) break;
            Message msg = std::move(queue_.front());
            queue_.pop();
            lock.unlock();
            processMessage(msg);
            ++processed_;
        }
    }
};`,
    java: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class ConcurrentProcessor {
    // BlockingQueue заменяет queue_ + mutex_ + cv_ вместе
    private final BlockingQueue<Message> queue;
    private final ExecutorService executor;
    private final AtomicLong processed = new AtomicLong(0);

    public ConcurrentProcessor(int numThreads) {
        // Ограничиваем размер очереди для backpressure
        this.queue = new LinkedBlockingQueue<>(10_000);
        this.executor = Executors.newFixedThreadPool(numThreads);

        for (int i = 0; i < numThreads; i++) {
            executor.submit(this::workerLoop);
        }
    }

    public void submit(Message msg) throws InterruptedException {
        // put() блокирует если очередь полна (backpressure)
        queue.put(msg);
    }

    public void shutdown() throws InterruptedException {
        executor.shutdown();
        executor.awaitTermination(30, TimeUnit.SECONDS);
    }

    public long processedCount() {
        return processed.get();
    }

    private void workerLoop() {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                // poll с таймаутом — не блокирует вечно
                Message msg = queue.poll(100, TimeUnit.MILLISECONDS);
                if (msg != null) {
                    processMessage(msg);
                    processed.incrementAndGet();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}`,
    notes: [
      "BlockingQueue инкапсулирует mutex + condition_variable — меньше кода, меньше ошибок",
      "Ограниченный размер очереди (10_000) реализует backpressure — защита от OOM под нагрузкой",
      "AtomicLong.incrementAndGet() — атомарный аналог ++processed_ из C++ std::atomic",
      "executor.awaitTermination() — аналог thread.join() для пула потоков",
      "На 10k RPS: 4 потока + LinkedBlockingQueue — достаточно для старта, профилируй дальше"
    ]
  }
];
