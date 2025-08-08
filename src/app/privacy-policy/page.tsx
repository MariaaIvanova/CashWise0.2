"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 mb-4">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад към началната страница
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Политика за поверителност
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Последна актуализация: {new Date().toLocaleDateString('bg-BG')}
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Въведение
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CashWise (&ldquo;ние&rdquo;, &ldquo;наш&rdquo;, &ldquo;нас&rdquo;) се ангажира да защитава вашата поверителност. 
                Тази Политика за поверителност обяснява как събираме, използваме и защитаваме 
                вашата лична информация когато използвате нашата платформа за финансово обучение.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Използвайки CashWise, вие се съгласявате със събирането и използването на 
                информацията в съответствие с тази политика.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Информация, която събираме
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                2.1 Информация за регистрация
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Имейл адрес</li>
                <li>Парола (шифрована)</li>
                <li>Пълно име</li>
                <li>Дата на създаване на профила</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                2.2 Профилна информация
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Профилна снимка (аватар)</li>
                <li>Дата на последна актуализация на профила</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                2.3 Данни за обучението
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Прогрес в курсовете</li>
                <li>Завършени етапи на обучение</li>
                <li>Резултати от тестове</li>
                <li>Време, прекарано в обучение</li>
                <li>Статистики за производителност</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                2.4 Техническа информация
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>IP адрес</li>
                <li>Тип браузър и операционна система</li>
                <li>Информация за устройството</li>
                <li>Логове за достъп и грешки</li>
                <li>Кеширани данни в localStorage</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Как използваме вашата информация
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>За предоставяне на персонализирано финансово обучение</li>
                <li>За проследяване на вашия прогрес в курсовете</li>
                <li>За подобряване на качеството на нашите образователни материали</li>
                <li>За комуникация с вас относно вашия акаунт</li>
                <li>За осигуряване на техническа поддръжка</li>
                <li>За защита срещу злоупотреба и измама</li>
                <li>За съответствие с правни изисквания</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Споделяне на информация
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Ние не продаваме, не отдаваме под наем и не споделяме вашата лична информация 
                с трети страни, освен в следните случаи:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>С ваше изрично съгласие</li>
                <li>Когато е необходимо за предоставяне на услугите ни</li>
                <li>За съответствие с правни изисквания или съдебни заповеди</li>
                <li>За защита на нашите права и собственост</li>
                <li>В случай на сливане или придобиване на компанията</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Защита на данните
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Ние прилагаме подходящи технически и организационни мерки за защита на вашата 
                лична информация срещу неоторизиран достъп, промяна, разкриване или унищожаване:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Шифроване на данните при предаване и съхранение</li>
                <li>Регулярни проверки за сигурност</li>
                <li>Ограничен достъп до личната информация</li>
                <li>Регулярни резервни копия</li>
                <li>Обучение на персонала за сигурност на данните</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Вашите права
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Имате следните права относно вашата лична информация:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Право на достъп до вашите данни</li>
                <li>Право на корекция на неточни данни</li>
                <li>Право на изтриване на вашите данни</li>
                <li>Право на ограничаване на обработката</li>
                <li>Право на преносимост на данните</li>
                <li>Право на възражение срещу обработката</li>
                <li>Право на оттегляне на съгласието</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Бисквитки и подобни технологии
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Използваме бисквитки и подобни технологии за:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Запазване на вашите предпочитания</li>
                <li>Осигуряване на сигурност на сесията</li>
                <li>Анализ на използването на платформата</li>
                <li>Подобряване на производителността</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Можете да контролирате използването на бисквитки чрез настройките на вашия браузър.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Съхранение на данните
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Запазваме вашата лична информация само толкова дълго, колкото е необходимо за:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Предоставяне на нашите услуги</li>
                <li>Съответствие с правни задължения</li>
                <li>Разрешаване на спорове</li>
                <li>Прилагане на нашите договорни права</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Когато данните вече не са необходими, те се изтриват сигурно.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Международен трансфер на данни
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Вашите данни могат да бъдат обработвани в страни извън вашата страна на пребиваване. 
                Ние гарантираме, че всички международни трансфери на данни се извършват в съответствие 
                с приложимите закони за защита на данните.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Деца
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Нашите услуги не са предназначени за лица под 13 години. Ние не събираме умишлено 
                лична информация от деца под 13 години. Ако открием, че сме събрали лична информация 
                от дете под 13 години, ще я изтрием незабавно.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Промени в политиката
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Можем да актуализираме тази Политика за поверителност от време на време. 
                Ще уведомим за значителни промени чрез:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Публикуване на нова версия на политиката</li>
                <li>Изпращане на имейл уведомление</li>
                <li>Показване на известие в приложението</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Препоръчваме ви да преглеждате тази политика периодично.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                12. Контакти
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Ако имате въпроси относно тази Политика за поверителност или нашите практики 
                за защита на данните, моля, свържете се с нас:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> privacy@cash-wise.app
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Уебсайт:</strong> https://cash-wise.app
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Адрес:</strong> България
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                13. Съответствие с GDPR
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                За потребители в Европейския съюз, тази политика е в съответствие с Общия регламент 
                за защита на данните (GDPR). Имате право да подадете жалба до надзорния орган за 
                защита на данните във вашата страна.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                © {new Date().getFullYear()} CashWise. Всички права запазени.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 