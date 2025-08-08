"use client";

import React from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
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
              Общи условия за ползване
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Последна актуализация: {new Date().toLocaleDateString('bg-BG')}
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Приемане на условията
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Чрез достъпването и използването на CashWise (&ldquo;Платформата&rdquo;), вие се съгласявате 
                да се придържате към тези Общи условия за ползване (&ldquo;Условията&rdquo;). Ако не се съгласявате 
                с която и да е част от тези условия, моля, не използвайте нашата платформа.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Описание на услугата
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CashWise е интерактивна платформа за финансово обучение, която предоставя:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Образователни курсове по финансова грамотност</li>
                <li>Интерактивни уроци и тестове</li>
                <li>Проследяване на прогреса в обучението</li>
                <li>Персонализирано съдържание</li>
                <li>Мобилно приложение за достъп</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Регистрация и акаунт
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                За да използвате пълните функции на платформата, трябва да създадете акаунт. 
                Вие отговаряте за:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Предоставянето на точна и актуална информация</li>
                <li>Защитата на вашите данни за вход</li>
                <li>Всички действия, извършени чрез вашия акаунт</li>
                <li>Веднага да ни уведомите за неоторизиран достъп</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Правила за използване
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Съгласявате се да не използвате платформата за:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Незаконни или вредни цели</li>
                <li>Нарушаване на правата на други потребители</li>
                <li>Разпространение на вируси или вреден код</li>
                <li>Опити за неоторизиран достъп до системите ни</li>
                <li>Спам или нежелани съобщения</li>
                <li>Нарушаване на интелектуалната собственост</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Интелектуална собственост
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Всичко съдържание на платформата, включително текстове, изображения, видео, 
                софтуер и дизайн, е собственост на CashWise или нашите лицензодатели и е 
                защитено от законите за интелектуална собственост.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Разрешено ви е да използвате съдържанието само за лични, некомерсиални цели 
                в рамките на платформата.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Отказ от отговорност
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Съдържанието на платформата е предоставено &ldquo;както е&rdquo; без гаранции. 
                CashWise не гарантира:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Непрекъснатост на услугата</li>
                <li>Отсутствие на грешки или вируси</li>
                <li>Точност на образователното съдържание</li>
                <li>Подходящост за конкретни цели</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Образователното съдържание не представлява финансов съвет и не трябва да се 
                разглежда като такъв.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Ограничаване на отговорността
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                CashWise не носи отговорност за:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Преки, косвени или случайни щети</li>
                <li>Загуба на данни или печалби</li>
                <li>Щети от използване на платформата</li>
                <li>Действия на трети страни</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Плащания и абонаменти
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Ако платформата предлага платени услуги:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Цените се показват в левове (BGN)</li>
                <li>Плащанията се обработват сигурно</li>
                <li>Абонаментите се обновяват автоматично</li>
                <li>Можете да отмените абонамента по всяко време</li>
                <li>Няма възстановяване на платените суми</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Прекратяване
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Можем да прекратим или ограничим достъпа ви до платформата по всяко време, 
                с или без предизвестие, поради:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Нарушаване на тези условия</li>
                <li>Незаконна дейност</li>
                <li>Технически проблеми</li>
                <li>Прекратяване на услугата</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Приложимо право
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Тези условия се управляват от българското право. Всички спорове ще се разрешават 
                от компетентните български съдилища.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Промени в условията
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Запазваме си правото да променяме тези условия по всяко време. Ще уведомим за 
                значителни промени чрез:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Публикуване на нови условия</li>
                <li>Изпращане на имейл уведомление</li>
                <li>Показване на известие в приложението</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                Продължаването на използването след промените означава приемане на новите условия.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                12. Контакти
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                За въпроси относно тези условия, моля, свържете се с нас:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> legal@cash-wise.app
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Уебсайт:</strong> https://cash-wise.app
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Адрес:</strong> България
                </p>
              </div>
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