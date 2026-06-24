package ai.runapi.veo31;

import ai.runapi.core.BaseClient;
import ai.runapi.core.ClientOptions;
import ai.runapi.core.http.HttpTransport;
import java.net.URI;
import ai.runapi.veo31.resources.ExtendVideoResource;
import ai.runapi.veo31.resources.TextToVideoResource;
import ai.runapi.veo31.resources.UpscaleVideoResource;

/** Veo31 model-family Java SDK client. */
public final class Veo31Client extends BaseClient {
  private final ExtendVideoResource extendVideo;
  private final TextToVideoResource textToVideo;
  private final UpscaleVideoResource upscaleVideo;

  private Veo31Client(ClientOptions options) {
    super(options);
    this.extendVideo = new ExtendVideoResource(transport(), options());
    this.textToVideo = new TextToVideoResource(transport(), options());
    this.upscaleVideo = new UpscaleVideoResource(transport(), options());
  }

  /** Creates a new Veo31Client builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Extend Video operations. */
  public ExtendVideoResource extendVideo() {
    return extendVideo;
  }

  /** Text To Video operations. */
  public TextToVideoResource textToVideo() {
    return textToVideo;
  }

  /** Upscale Video operations. */
  public UpscaleVideoResource upscaleVideo() {
    return upscaleVideo;
  }

  /** Builder for {@link Veo31Client}. */
  public static final class Builder extends BaseClient.Builder<Builder> {
    private Builder() {}

    /** Sets the API key. If omitted, the SDK reads {@code RUNAPI_API_KEY}. */
    @Override
    public Builder apiKey(String value) {
      return super.apiKey(value);
    }

    /** Sets the RunAPI base URL. If omitted, the SDK reads {@code RUNAPI_BASE_URL}. */
    @Override
    public Builder baseUrl(String value) {
      return super.baseUrl(value);
    }

    /** Sets the RunAPI base URL from a URI. */
    @Override
    public Builder baseUrl(URI value) {
      return super.baseUrl(value);
    }

    /** Sets a custom HTTP transport. User-provided transports are not closed by SDK clients. */
    @Override
    public Builder transport(HttpTransport value) {
      return super.transport(value);
    }

    /** Builds an immutable Veo31Client. */
    @Override
    public Veo31Client build() {
      return new Veo31Client(options.build());
    }
  }
}
