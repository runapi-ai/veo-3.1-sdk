package ai.runapi.veo31.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Parameters for extend video operations. */
public final class ExtendVideoParams {
  private final String sourceTaskId;
  private final String prompt;
  private final Integer seeds;
  private final Boolean watermark;
  private final String callbackUrl;

  private ExtendVideoParams(Builder builder) {
    this.sourceTaskId = Veo31ParamUtils.requireNonBlank(builder.sourceTaskId, "sourceTaskId");
    this.prompt = builder.prompt;
    this.seeds = builder.seeds;
    this.watermark = builder.watermark;
    this.callbackUrl = builder.callbackUrl;
  }

  /** Creates a new ExtendVideoParams builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the RunAPI action key for this request. */
  public String action() {
    return "veo-3-1/extend-video";
  }

  /** Converts these parameters to the JSON request body shape. */
  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("source_task_id", Veo31ParamUtils.wireValue(sourceTaskId));
    raw.put("prompt", Veo31ParamUtils.wireValue(prompt));
    raw.put("seeds", Veo31ParamUtils.wireValue(seeds));
    raw.put("watermark", Veo31ParamUtils.wireValue(watermark));
    raw.put("callback_url", Veo31ParamUtils.wireValue(callbackUrl));
    return Veo31ParamUtils.compact(raw);
  }



  /** Builder for {@link ExtendVideoParams}. */
  public static final class Builder {
    private String sourceTaskId;
    private String prompt;
    private Integer seeds;
    private Boolean watermark;
    private String callbackUrl;

    private Builder() {}

    /** Sets the source task ID. */
    public Builder sourceTaskId(String value) {
      this.sourceTaskId = Veo31ParamUtils.requireNonBlank(value, "sourceTaskId");
      return this;
    }

    /** Sets the text prompt. */
    public Builder prompt(String value) {
      this.prompt = Veo31ParamUtils.requireNonBlank(value, "prompt");
      return this;
    }

    /** Sets the seeds. */
    public Builder seeds(int value) {
      this.seeds = value;
      return this;
    }

    /** Sets the watermark toggle. */
    public Builder watermark(boolean value) {
      this.watermark = value;
      return this;
    }

    /** Sets the webhook URL for task completion notifications. */
    public Builder callbackUrl(String value) {
      this.callbackUrl = Veo31ParamUtils.requireNonBlank(value, "callbackUrl");
      return this;
    }

    /** Builds immutable extend video parameters. */
    public ExtendVideoParams build() {
      return new ExtendVideoParams(this);
    }
  }
}
