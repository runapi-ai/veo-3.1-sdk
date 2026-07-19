<p align="center">
  <a href="https://runapi.ai"><img src="https://runapi.ai/icon.svg" height="56" alt="RunAPI"></a>
</p>

<h3 align="center">
  <a href="https://github.com/runapi-ai/veo-3.1-sdk">Veo 3 API SDK for RunAPI</a>
</h3>

<p align="center">
  Veo 3 API SDKs for JavaScript, Python, Ruby, Go, Java, and PHP on RunAPI.
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/@runapi.ai/veo-3.1)](https://www.npmjs.com/package/@runapi.ai/veo-3.1)
[![PyPI](https://img.shields.io/pypi/v/runapi-veo-3-1)](https://pypi.org/project/runapi-veo-3-1/)
[![RubyGems](https://img.shields.io/gem/v/runapi-veo-3.1)](https://rubygems.org/gems/runapi-veo-3.1)
[![Go Reference](https://pkg.go.dev/badge/github.com/runapi-ai/veo-3.1-sdk/go.svg)](https://pkg.go.dev/github.com/runapi-ai/veo-3.1-sdk/go)
[![Maven Central](https://img.shields.io/maven-central/v/ai.runapi/runapi-veo-3.1)](https://central.sonatype.com/artifact/ai.runapi/runapi-veo-3.1)
[![License](https://img.shields.io/github/license/runapi-ai/veo-3.1-sdk)](https://github.com/runapi-ai/veo-3.1-sdk/blob/main/LICENSE)

</div>
<br/>

The Veo 3 API SDK packages JavaScript, Python, Ruby, Go, Java, and PHP clients for Veo 3 on RunAPI. Use it for text-to-video, video extension, and video upscale workflows when your app needs typed request builders, predictable task polling, file upload helpers, account helpers, and consistent RunAPI errors.

Veo 3 is listed in the RunAPI model catalog at https://runapi.ai/models/veo-3.1. Variant pages below carry pricing, rate-limit, and commercial-usage details. The public `veo-3.1-sdk` repository groups the non-PHP language packages, examples, CI, and release tags for this model. The PHP package is released from a split Composer repository.

## Install

```bash
npm install @runapi.ai/veo-3.1
pip install runapi-veo-3-1
gem install runapi-veo-3.1
go get github.com/runapi-ai/veo-3.1-sdk/go@latest
```

Gradle:

```kotlin
dependencies {
  implementation("ai.runapi:runapi-veo-3.1:0.1.1")
}
```

Maven:

```xml
<dependency>
  <groupId>ai.runapi</groupId>
  <artifactId>runapi-veo-3.1</artifactId>
  <version>0.1.1</version>
</dependency>
```

Use the Java BOM when installing multiple RunAPI Java modules:

```kotlin
dependencies {
  implementation(platform("ai.runapi:runapi-bom:0.1.7"))
  implementation("ai.runapi:runapi-veo-3.1")
}
```

The PHP package is published from the split Composer repository as `runapi-ai/veo-3.1`; see https://github.com/runapi-ai/veo-3.1-php for PHP install and examples.

## What you can build

- Build apps, agent workflows, batch jobs, and production services around Veo 3 requests.
- Install only the language package your app needs while keeping one model-specific repository for docs and releases.
- Use `create` for submit-only jobs, `get` for status lookup, and `run` for submit-and-poll scripts.
- Upload local files, URL files, or base64 files through shared RunAPI file helpers.
- Handle validation, authentication, rate limits, insufficient credits, task failures, and polling timeouts through RunAPI SDK errors.

## Java quick start

```java
import ai.runapi.veo31.Veo31Client;
import ai.runapi.veo31.types.TextToVideoParams;
import ai.runapi.veo31.types.CompletedTextToVideoResponse;
import ai.runapi.veo31.types.TextToVideoModel;

Veo31Client client = Veo31Client.builder()
    .apiKey(System.getenv("RUNAPI_API_KEY"))
    .build();

CompletedTextToVideoResponse result = client.textToVideo().run(
    TextToVideoParams.builder()
        .model(TextToVideoModel.VEO_3_1)
        .prompt("A graceful orbit shot around a glass observatory")
        .aspectRatio("16:9")
        .durationSeconds(4)
        .build()
);
```

Java packages target Java 8 bytecode and are tested on Java 8, 11, 17, and 21. Each model artifact depends on `ai.runapi:runapi-core`, so application code normally installs only `ai.runapi:runapi-veo-3.1`.

## Task lifecycle

Most media endpoints are asynchronous. `create()` submits a task and returns its id, `get(id)` fetches the latest task state, and `run(params)` creates the task and polls until it reaches a terminal state. In web request handlers, prefer `create()` plus webhook or later `get()` polling so the server does not hold a worker open.

## Repository layout

- `js/` publishes `@runapi.ai/veo-3.1`.
- `python/` publishes `runapi-veo-3-1`.
- `ruby/` publishes `runapi-veo-3.1`.
- `go/` publishes `github.com/runapi-ai/veo-3.1-sdk/go` and depends on `github.com/runapi-ai/core-sdk/go`.
- `java/` publishes `ai.runapi:runapi-veo-3.1` and depends on `ai.runapi:runapi-core`.

## Public links

- Model page: https://runapi.ai/models/veo-3.1
- SDK docs: https://runapi.ai/docs#sdk-veo-3.1
- Product docs: https://runapi.ai/docs#veo-3.1
- SDK repository: https://github.com/runapi-ai/veo-3.1-sdk
- PHP package repository: https://github.com/runapi-ai/veo-3.1-php
- Skill repository: https://github.com/runapi-ai/veo-3.1
- Provider comparison: https://runapi.ai/providers/google
- Full catalog: https://runapi.ai/models

## Pricing and variants

Use the most specific Veo 3 variant page for pricing, rate limits, and commercial usage:
- [Veo 3](https://runapi.ai/models/veo-3.1/veo-3.1)
- [Veo 3 fast](https://runapi.ai/models/veo-3.1/fast)

Default pricing link for the Veo 3 SDK: https://runapi.ai/models/veo-3.1/veo-3.1

## File storage

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## FAQ

### Which package should I install for Veo 3 work?

Install the model package for your language: `@runapi.ai/veo-3.1` on npm, `runapi-veo-3-1` on PyPI, `runapi-veo-3.1` on RubyGems, `github.com/runapi-ai/veo-3.1-sdk/go`, `ai.runapi:runapi-veo-3.1` on Maven Central, or `runapi-ai/veo-3.1` on Packagist. Install core SDK packages only when you are building shared SDK infrastructure.

### Where should public links point?

Primary Veo 3 links point to https://runapi.ai/models/veo-3.1. Pricing and usage-policy links point to variant pages such as https://runapi.ai/models/veo-3.1/veo-3.1. Provider comparisons point to https://runapi.ai/providers/google, and broad browsing points to https://runapi.ai/models.

## License

Licensed under the Apache License, Version 2.0.
