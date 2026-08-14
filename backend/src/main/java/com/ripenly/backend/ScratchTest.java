import dev.brachtendorf.jimagehash.hashAlgorithms.PerceptiveHash;
import dev.brachtendorf.jimagehash.hash.Hash;
import java.awt.image.BufferedImage;
import java.math.BigInteger;

public class ScratchTest {
    public static void main(String[] args) throws Exception {
        BufferedImage img = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);
        PerceptiveHash hasher = new PerceptiveHash(32);
        Hash hash = hasher.hash(img);
        System.out.println("Hash string: " + hash.getHashValue().toString(16));
        System.out.println("Algorithm ID: " + hash.getAlgorithmId());
    }
}
