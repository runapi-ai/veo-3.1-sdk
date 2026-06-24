package ai.runapi.veo31.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Parameters for upscale video operations. */
public final class UpscaleVideoParams {
  private final String sourceTaskId;
  private final String outputResolution;
  private final Integer index;
  private final String callbackUrl;

  private UpscaleVideoParams(Builder builder) {
    this.sourceTaskId = builder.sourceTaskId;
    this.outputResolution = builder.outputResolution;
    this.index = builder.index;
    this.callbackUrl = builder.callbackUrl;
  }

  /** Creates a new UpscaleVideoParams builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the RunAPI action key for this request. */
  public String action() {
    return "veo-3-1/upscale-video";
  }

  /** Converts these parameters to the JSON request body shape. */
  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("source_task_id", Veo31ParamUtils.wireValue(sourceTaskId));
    raw.put("output_resolution", Veo31ParamUtils.wireValue(outputResolution));
    raw.put("index", Veo31ParamUtils.wireValue(index));
    raw.put("callback_url", Veo31ParamUtils.wireValue(callbackUrl));
    return Veo31ParamUtils.compact(raw);
  }



  /** Builder for {@link UpscaleVideoParams}. */
  public static final class Builder {
    private String sourceTaskId;
    private String outputResolution;
    private Integer index;
    private String callbackUrl;

    private Builder() {}

    /** Sets the source task ID. */
    public Builder sourceTaskId(String value) {
      this.sourceTaskId = Veo31ParamUtils.requireNonBlank(value, "sourceTaskId");
      return this;
    }

    /** Sets the output resolution. */
    public Builder outputResolution(String value) {
      this.outputResolution = Veo31ParamUtils.requireNonBlank(value, "outputResolution");
      return this;
    }

    /** Sets the index. */
    public Builder index(int value) {
      this.index = value;
      return this;
    }

    /** Sets the webhook URL for task completion notifications. */
    public Builder callbackUrl(String value) {
      this.callbackUrl = Veo31ParamUtils.requireNonBlank(value, "callbackUrl");
      return this;
    }

    /** Builds immutable upscale video parameters. */
    public UpscaleVideoParams build() {
      return new UpscaleVideoParams(this);
    }
  }
}
