# capacitor-inappbrowser `javascriptBridgeOrigins` repro

Reproduces [Cap-go/capacitor-inappbrowser#768](https://github.com/Cap-go/capacitor-inappbrowser/issues/768) with `@capgo/capacitor-inappbrowser` 8.27.0 on Android.

## Run

Needs a device or emulator. Bug 1 needs Android 13 or lower.

```sh
pnpm install
pnpm build
npx cap add android
npx cap run android
```

The app has two buttons. Each one opens `example.com` with `javascriptBridgeOrigins: ['https://example.com']`, calls `window.mobileApp.postMessage` in the page, closes the webview and prints PASS or FAIL.

## Branches

| Branch | Plugin | `Open ?a=1` | `Open ?a=1\|2` |
|---|---|---|---|
| `main` | 8.27.0 | Crash below Android 14 | Crash below Android 14 |
| `crash-fix-only` | 8.27.0 + [`1fa91d97`](https://github.com/Cap-go/capacitor-inappbrowser/pull/769/commits/1fa91d97) | PASS | FAIL |
| `with-fix` | 8.27.0 + [#769](https://github.com/Cap-go/capacitor-inappbrowser/pull/769) | PASS | PASS |

Results are from Android 13 (API 33). On Android 14 or newer I'd expect `main` to behave like `crash-fix-only`, but I haven't run that.

The branches apply the fixes with a `pnpm` patch, in `patches/`. Run `npx cap sync android` after switching branches.

## Bug 1: crash

Logcat on `main` after tapping either button:

```
java.lang.NoSuchMethodError: No virtual method formatted([Ljava/lang/Object;)Ljava/lang/String; in class Ljava/lang/String;
    at ee.forgr.capacitor_inappbrowser.MobileAppBridgeScript.create(MobileAppBridgeScript.java:105)
```

## Bug 2: page blocked by its URL

Logcat on `crash-fix-only` after tapping `Open ?a=1|2`:

```
W InAppBrowser: Blocked JavaScript bridge call postMessage for origin null
```
