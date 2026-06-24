package ai.runapi.veo31.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for text to video operations. */
public final class TextToVideoModel extends Veo31Value {
  /** veo-3.1 model slug. */
  public static final TextToVideoModel VEO_3_1 = new TextToVideoModel("veo-3.1");
  /** veo-3.1-fast model slug. */
  public static final TextToVideoModel VEO_3_1_FAST = new TextToVideoModel("veo-3.1-fast");

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public TextToVideoModel(String value) {
    super(value);
  }
}
