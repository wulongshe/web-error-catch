// Ambient declarations for Nuxt virtual modules. These resolve at the user
// project's build time via Nuxt's bundler; tsc in this package cannot see them
// without stubs.

declare module '#app' {
  export interface NuxtApp {
    vueApp: { config: { errorHandler: ((err: unknown, instance: unknown, info: string) => void) | null } };
    hook(name: 'vue:error', cb: (err: unknown) => void): void;
    hook(name: 'app:error', cb: (err: unknown) => void): void;
    hook(name: string, cb: (...args: any[]) => any): void;
  }
  export function defineNuxtPlugin<T = unknown>(plugin: (nuxtApp: NuxtApp) => T): (nuxtApp: NuxtApp) => T;
  export function useRuntimeConfig(): { public: Record<string, any> };
}

declare module '#imports' {
  export function useRuntimeConfig(): { public: Record<string, any> };
}
