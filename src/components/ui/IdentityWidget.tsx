import { useState } from 'react';
import type { AppCustomizationSettings } from '../../types';
import { copyTextToClipboard } from '../../utils/clipboard';

interface IdentityAccount {
  id: string;
  companyCode: string;
  username: string;
}

const globalRgaCredentials = {
  username: 'DavidFR_Ext@segurosrga.es',
  password: 'De$Minsait.Rg@',
};

const masterPassword = 'T3$t01p@2020';

const identityAccounts: IdentityAccount[] = [
  {
    id: 'company-01',
    companyCode: '01',
    username: 'testoip4',
  },
  {
    id: 'company-02',
    companyCode: '02',
    username: 'testoip3',
  },
];

const maskedValue = '********************';

interface IdentityWidgetProps {
  customization: AppCustomizationSettings;
}

export function IdentityWidget({ customization }: IdentityWidgetProps) {
  const [isGlobalRgaVisible, setIsGlobalRgaVisible] = useState(false);
  const shouldShowSidebarIdentity = customization.showSidebarIdentity;
  const shouldShowGlobalCredentials = customization.showGlobalCredentials;

  if (!shouldShowSidebarIdentity && !shouldShowGlobalCredentials) {
    return null;
  }

  return (
    <div className="space-y-4">
      {shouldShowSidebarIdentity ? (
        <div className="sidebar-panel rounded-[1.7rem] border border-slate-200/80 p-4 dark:border-slate-800">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
            {customization.sidebarIdentityTitle}
          </p>

          <section className="sidebar-section-card mt-4 rounded-2xl border border-slate-200/80 p-3 dark:border-slate-800">
            <div className="sidebar-link-card flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 px-3 py-2.5 dark:border-slate-800">
              <span className="truncate rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm font-semibold tracking-[0.08em] text-slate-800 dark:bg-black dark:text-white">
                {masterPassword}
              </span>
              <button
                type="button"
                onClick={() => copyTextToClipboard(masterPassword)}
                aria-label="Copiar clave maestra"
                title="Copiar clave maestra"
                className="sidebar-soft-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-slate-600 transition-all duration-200 hover:text-sky-700 dark:text-slate-200 dark:hover:text-white"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4"
                >
                  <rect
                    x="7"
                    y="3"
                    width="9"
                    height="11"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 7H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                {customization.companyUsersLabel}
              </p>
              <div className="mt-2 space-y-2">
                {identityAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="sidebar-link-card flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 px-3 py-2.5 dark:border-slate-800"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-sky-50 px-2 text-[11px] font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                        {account.companyCode}
                      </span>
                      <span className="truncate rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm font-medium text-slate-800 dark:bg-black dark:text-white">
                        {account.username}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyTextToClipboard(account.username)}
                      aria-label={`Copiar usuario ${account.username} de compania ${account.companyCode}`}
                      title="Copiar usuario"
                      className="sidebar-soft-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-slate-600 transition-all duration-200 hover:text-sky-700 dark:text-slate-200 dark:hover:text-white"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-4 w-4"
                      >
                        <rect
                          x="7"
                          y="3"
                          width="9"
                          height="11"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M5 7H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {shouldShowGlobalCredentials ? (
        <div className="sidebar-panel rounded-[1.7rem] border border-slate-200/80 p-4 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
              {customization.globalRgaTitle}
            </p>
            <button
              type="button"
              onClick={() => setIsGlobalRgaVisible((currentValue) => !currentValue)}
              className="sidebar-soft-button rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:text-white"
            >
              {isGlobalRgaVisible ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <section className="mt-4 space-y-2">
            <div className="sidebar-section-card rounded-2xl border border-slate-200/80 p-3 dark:border-slate-800">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                {customization.globalUserLabel}
              </p>
              <div className="sidebar-link-card mt-2 flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 px-3 py-2.5 dark:border-slate-800">
                <span className="truncate rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm font-medium text-slate-800 dark:bg-black dark:text-white">
                  {isGlobalRgaVisible ? globalRgaCredentials.username : maskedValue}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyTextToClipboard(
                      isGlobalRgaVisible
                        ? globalRgaCredentials.username
                        : 'Credencial oculta',
                    )
                  }
                  aria-label="Copiar usuario Global Prysma"
                  title="Copiar usuario"
                  className="sidebar-soft-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-slate-600 transition-all duration-200 hover:text-violet-700 dark:text-slate-200 dark:hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <rect
                      x="7"
                      y="3"
                      width="9"
                      height="11"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5 7H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="sidebar-section-card rounded-2xl border border-slate-200/80 p-3 dark:border-slate-800">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
                {customization.globalPasswordLabel}
              </p>
              <div className="sidebar-link-card mt-2 flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 px-3 py-2.5 dark:border-slate-800">
                <span className="truncate rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm font-medium text-slate-800 dark:bg-black dark:text-white">
                  {isGlobalRgaVisible ? globalRgaCredentials.password : maskedValue}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyTextToClipboard(
                      isGlobalRgaVisible
                        ? globalRgaCredentials.password
                        : 'Credencial oculta',
                    )
                  }
                  aria-label="Copiar password Global Prysma"
                  title="Copiar password"
                  className="sidebar-soft-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-slate-600 transition-all duration-200 hover:text-violet-700 dark:text-slate-200 dark:hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <rect
                      x="7"
                      y="3"
                      width="9"
                      height="11"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M5 7H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
