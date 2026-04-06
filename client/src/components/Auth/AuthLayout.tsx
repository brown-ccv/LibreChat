import { ThemeContext, ThemeSelector } from '@librechat/client';
import { TStartupConfig } from 'librechat-data-provider';
import { ErrorMessage } from '~/components/Auth/ErrorMessage';
import { TranslationKeys, useLocalize } from '~/hooks';
import SocialLoginRender from './SocialLoginRender';
import { BlinkAnimation } from './BlinkAnimation';
import { Banner } from '../Banners';
import Footer from './Footer';
import { useContext } from 'react';

function AuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: TranslationKeys | null;
}) {
  const { theme } = useContext(ThemeContext);

  const logoSrc = theme === 'dark' ? '/assets/logo-dark.svg' : '/assets/logo.svg';
  const localize = useLocalize();

  const hasStartupConfigError = startupConfigError !== null && startupConfigError !== undefined;
  const DisplayError = () => {
    if (hasStartupConfigError) {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>{localize('com_auth_error_login_server')}</ErrorMessage>
        </div>
      );
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>
            {localize('com_auth_error_invalid_reset_token')}{' '}
            <a className="font-semibold text-green-600 hover:underline" href="/forgot-password">
              {localize('com_auth_click_here')}
            </a>{' '}
            {localize('com_auth_to_try_again')}
          </ErrorMessage>
        </div>
      );
    } else if (error != null && error) {
      return (
        <div className="mx-auto sm:max-w-sm">
          <ErrorMessage>{localize(error)}</ErrorMessage>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Banner />

      <DisplayError />
      <div className="absolute bottom-0 left-0 md:m-4">
        <ThemeSelector />
      </div>

      <main className="flex flex-grow items-center justify-center">
        <div className="flex flex-col items-center">
          <BlinkAnimation active={isFetching}>
            <div className="mb-4 h-16 w-48 bg-cover">
              <img
                src={logoSrc}
                className="h-full w-full object-contain"
                alt={localize('com_ui_logo', { 0: startupConfig?.appTitle ?? 'LibreChat' })}
              />
            </div>
          </BlinkAnimation>

          <div className="flex flex-col items-center lg:flex-row lg:items-start lg:gap-6">
            {pathname.includes('login') && (
              <div className="hidden w-64 rounded-2xl border border-border-light bg-surface-secondary px-5 py-4 lg:block">
                <p className="mb-1 text-sm font-semibold text-text-primary">Model Token Cost</p>
                <p className="mb-4 text-xs leading-relaxed text-text-secondary">
                  Each model is rated by its token consumption cost. Higher-tier models offer
                  greater reasoning capability but consume more tokens. Please select models
                  appropriate to your task to help manage your monthly max usage ($20).
                  For more information on token costs, please visit this{' '}<a
                    href="https://docs.google.com/spreadsheets/d/1BY24ps-nLNp3wldrtRjvo0Edqmzyf3t97qS5flEZ-e0/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-green-600 underline hover:text-green-700 focus:text-green-700 dark:text-green-500 dark:hover:text-green-400 dark:focus:text-green-400"
                  >
                    pricing list
                  </a>
                  .
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-8 font-semibold text-green-600 dark:text-green-400">$</span>
                    <span className="text-text-secondary">Economy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 font-semibold text-yellow-600 dark:text-yellow-400">$$</span>
                    <span className="text-text-secondary">Standard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 font-semibold text-red-600 dark:text-red-400">$$$</span>
                    <span className="text-text-secondary">Premium</span>
                  </div>
                </div>
              </div>
            )}
          <div className="w-authPageWidth overflow-hidden bg-white px-6 py-4 dark:bg-gray-900 sm:max-w-md sm:rounded-lg">
            {!hasStartupConfigError && !isFetching && header && (
              <h1
                className="mb-4 text-center text-3xl font-semibold text-black dark:text-white"
                style={{ userSelect: 'none' }}
              >
                {header}
              </h1>
            )}
            {children}
            {!pathname.includes('2fa') &&
              (pathname.includes('login') || pathname.includes('register')) && (
                <SocialLoginRender startupConfig={startupConfig} />
              )}
          </div>
          </div>
        </div>
      </main>
      <Footer startupConfig={startupConfig} />
    </div>
  );
}

export default AuthLayout;
