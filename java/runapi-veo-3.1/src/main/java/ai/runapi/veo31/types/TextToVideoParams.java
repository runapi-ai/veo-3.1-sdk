package ai.runapi.veo31.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Parameters for text to video operations. */
public final class TextToVideoParams {
  private final String prompt;
  private final String model;
  private final String inputMode;
  private final String aspectRatio;
  private final Integer durationSeconds;
  private final Integer seeds;
  private final String callbackUrl;
  private final Boolean enableTranslation;
  private final Boolean watermark;
  private final String firstFrameImageUrl;
  private final String lastFrameImageUrl;
  private final List<String> referenceImageUrls;

  private TextToVideoParams(Builder builder) {
    this.prompt = builder.prompt;
    this.model = builder.model;
    this.inputMode = builder.inputMode;
    this.aspectRatio = builder.aspectRatio;
    this.durationSeconds = builder.durationSeconds;
    this.seeds = builder.seeds;
    this.callbackUrl = builder.callbackUrl;
    this.enableTranslation = builder.enableTranslation;
    this.watermark = builder.watermark;
    this.firstFrameImageUrl = builder.firstFrameImageUrl;
    this.lastFrameImageUrl = builder.lastFrameImageUrl;
    this.referenceImageUrls = Veo31ParamUtils.strings(builder.referenceImageUrls);
  }

  /** Creates a new TextToVideoParams builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the RunAPI action key for this request. */
  public String action() {
    return "veo-3-1/text-to-video";
  }

  /** Converts these parameters to the JSON request body shape. */
  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("prompt", Veo31ParamUtils.wireValue(prompt));
    raw.put("model", Veo31ParamUtils.wireValue(model));
    raw.put("input_mode", Veo31ParamUtils.wireValue(inputMode));
    raw.put("aspect_ratio", Veo31ParamUtils.wireValue(aspectRatio));
    raw.put("duration_seconds", Veo31ParamUtils.wireValue(durationSeconds));
    raw.put("seeds", Veo31ParamUtils.wireValue(seeds));
    raw.put("callback_url", Veo31ParamUtils.wireValue(callbackUrl));
    raw.put("enable_translation", Veo31ParamUtils.wireValue(enableTranslation));
    raw.put("watermark", Veo31ParamUtils.wireValue(watermark));
    raw.put("first_frame_image_url", Veo31ParamUtils.wireValue(firstFrameImageUrl));
    raw.put("last_frame_image_url", Veo31ParamUtils.wireValue(lastFrameImageUrl));
    raw.put("reference_image_urls", Veo31ParamUtils.wireValue(referenceImageUrls));
    return Veo31ParamUtils.compact(raw);
  }



  /** Builder for {@link TextToVideoParams}. */
  public static final class Builder {
    private String prompt;
    private String model;
    private String inputMode;
    private String aspectRatio;
    private Integer durationSeconds;
    private Integer seeds;
    private String callbackUrl;
    private Boolean enableTranslation;
    private Boolean watermark;
    private String firstFrameImageUrl;
    private String lastFrameImageUrl;
    private List<String> referenceImageUrls;

    private Builder() {}

    /** Sets the text prompt. */
    public Builder prompt(String value) {
      this.prompt = Veo31ParamUtils.requireNonBlank(value, "prompt");
      return this;
    }

    /** Sets the model slug using a typed model value. */
    public Builder model(TextToVideoModel value) {
      this.model = java.util.Objects.requireNonNull(value, "model").value();
      return this;
    }

    /** Sets the model slug using a string value. */
    public Builder model(String value) {
      this.model = Veo31ParamUtils.requireNonBlankTrim(value, "model");
      return this;
    }


    /** Sets the input mode. */
    public Builder inputMode(String value) {
      this.inputMode = Veo31ParamUtils.requireNonBlank(value, "inputMode");
      return this;
    }

    /** Sets the output aspect ratio. */
    public Builder aspectRatio(String value) {
      this.aspectRatio = Veo31ParamUtils.requireNonBlank(value, "aspectRatio");
      return this;
    }

    /** Sets the duration in seconds. */
    public Builder durationSeconds(int value) {
      this.durationSeconds = value;
      return this;
    }

    /** Sets the seeds. */
    public Builder seeds(int value) {
      this.seeds = value;
      return this;
    }

    /** Sets the webhook URL for task completion notifications. */
    public Builder callbackUrl(String value) {
      this.callbackUrl = Veo31ParamUtils.requireNonBlank(value, "callbackUrl");
      return this;
    }

    /** Sets the enable translation. */
    public Builder enableTranslation(boolean value) {
      this.enableTranslation = value;
      return this;
    }

    /** Sets the watermark toggle. */
    public Builder watermark(boolean value) {
      this.watermark = value;
      return this;
    }

    /** Sets the first frame image URL. */
    public Builder firstFrameImageUrl(String value) {
      this.firstFrameImageUrl = Veo31ParamUtils.requireNonBlank(value, "firstFrameImageUrl");
      return this;
    }

    /** Sets the last frame image URL. */
    public Builder lastFrameImageUrl(String value) {
      this.lastFrameImageUrl = Veo31ParamUtils.requireNonBlank(value, "lastFrameImageUrl");
      return this;
    }

    /** Sets the reference image URLs. */
    public Builder referenceImageUrls(List<String> value) {
      this.referenceImageUrls = value;
      return this;
    }

    /** Builds immutable text to video parameters. */
    public TextToVideoParams build() {
      return new TextToVideoParams(this);
    }
  }
}
